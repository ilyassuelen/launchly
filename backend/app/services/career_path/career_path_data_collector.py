from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from backend.app.models.resume.resume import Resume
from backend.app.models.recruiter.recruiter import RecruiterViewAnalysis
from backend.app.models.linkedin.linkedin_profile import LinkedInProfile
from backend.app.models.portfolio.portfolio_profile import PortfolioProfile
from backend.app.models.applications.application import Application
from backend.app.models.interview.interview_result import InterviewResult
from backend.app.models.dashboard.dashboard_snapshot import DashboardSnapshot
from backend.app.models.dashboard.dashboard_review import DashboardReview
from backend.app.services.privacy.llm_privacy import prepare_data


MAX_ITEMS = 8
MAX_TEXT_LENGTH = 1200


def _safe_text(value: Any) -> str:
    if value is None:
        return ""

    text = str(value).strip()

    if len(text) > MAX_TEXT_LENGTH:
        return text[:MAX_TEXT_LENGTH].rstrip() + "..."

    return text


def _safe_list(value: Any) -> list:
    if isinstance(value, list):
        return [
            item
            for item in value
            if item not in [None, "", [], {}]
        ]

    if isinstance(value, str) and value.strip():
        return [
            item.strip()
            for item in value.replace(";", ",").replace("\n", ",").split(",")
            if item.strip()
        ]

    return []


def _safe_dict(value: Any) -> dict:
    if isinstance(value, dict):
        return value

    return {}


def _extract_structured_resume_analysis(analysis: dict) -> dict:
    """
    Extract the reusable structured resume payload from
    the latest resume analysis if it exists.
    """
    structured = _safe_dict(
        analysis.get("structured_resume_data"),
    )

    if structured:
        return structured

    return {
        key: value
        for key, value in analysis.items()
        if key not in [
            "smart_suggestions",
            "recruiter_analysis",
            "ats_score",
            "raw_ai_analysis",
        ] and value not in [None, "", [], {}]
    }


def _serialize_date(value: Any) -> str | None:
    if value is None:
        return None

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return str(value)


def _limit(items: list, limit: int = MAX_ITEMS) -> list:
    return items[:limit]


def _extract_resume_skills(
    resume_data: dict,
    analysis: dict,
    structured_analysis: dict | None = None,
) -> list:
    """
    Extract and deduplicate relevant skills from resume data,
    structured resume analysis and the latest stored analysis.
    """
    values = []

    sources = [
        structured_analysis or {},
        resume_data,
        analysis,
    ]

    for source in sources:
        for key in [
            "skills",
            "technical_skills",
            "soft_skills",
            "hard_skills",
            "detected_skills",
            "core_skills",
            "key_skills",
            "tools",
            "technologies",
            "tech_stack",
        ]:
            values.extend(_safe_list(source.get(key)))

    seen = set()
    result = []

    for value in values:
        text = _safe_text(value)

        if not text:
            continue

        key = text.lower()

        if key in seen:
            continue

        seen.add(key)
        result.append(text)

    return _limit(result, 20)


def _extract_resume_summary(
    resume_data: dict,
    analysis: dict,
    structured_analysis: dict | None = None,
) -> str:
    """
    Find the best available resume summary from
    structured resume data or analysis results.
    """
    sources = [
        structured_analysis or {},
        resume_data,
        analysis,
    ]

    for source in sources:
        for key in [
            "summary",
            "professional_summary",
            "profile_summary",
            "candidate_summary",
            "overview",
            "content_summary",
            "resume_summary",
        ]:
            text = _safe_text(source.get(key))

            if text:
                return text

    return ""


def _collect_latest_resume(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect the latest resume data and analysis
    for the career path context.
    """
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.updated_at.desc())
        .first()
    )

    if not resume:
        return {}

    resume_data = prepare_data(
        _safe_dict(resume.data),
    )
    analysis = prepare_data(
        _safe_dict(resume.latest_resume_analysis),
    )
    structured_analysis = prepare_data(
        _extract_structured_resume_analysis(
            analysis,
        ),
    )

    return {
        "id": resume.id,
        "title": resume.title,
        "template": resume.template,
        "latest_ats_score": resume.latest_ats_score,
        "analyzed_at": _serialize_date(resume.analyzed_at),
        "summary": _extract_resume_summary(
            resume_data=resume_data,
            analysis=analysis,
            structured_analysis=structured_analysis,
        ),
        "skills": _extract_resume_skills(
            resume_data=resume_data,
            analysis=analysis,
            structured_analysis=structured_analysis,
        ),
        "raw_data": resume_data,
        "latest_analysis": analysis,
        "structured_resume_data": structured_analysis,
        "target_role": (
            structured_analysis.get("target_role")
            or resume_data.get("target_role")
            or resume_data.get("basics", {}).get("title")
            or resume.title
        ),
        "candidate_level": structured_analysis.get("candidate_level"),
        "seniority": structured_analysis.get("seniority"),
        "experience_level": structured_analysis.get("experience_level"),
        "technical_skills": _safe_list(
            structured_analysis.get("technical_skills"),
        ),
        "tools": _safe_list(
            structured_analysis.get("tools"),
        ),
        "technologies": _safe_list(
            structured_analysis.get("technologies"),
        ),
        "tech_stack": _safe_list(
            structured_analysis.get("tech_stack"),
        ),
        "experiences": _limit(
            _safe_list(
                structured_analysis.get("experience")
                or structured_analysis.get("work_experience")
                or structured_analysis.get("professional_experience")
                or resume_data.get("experiences")
                or resume_data.get("experience")
                or resume_data.get("work_experience")
                or resume_data.get("professional_experience")
            ),
        ),
        "projects": _limit(
            _safe_list(
                structured_analysis.get("projects")
                or structured_analysis.get("portfolio_projects")
                or resume_data.get("projects")
                or resume_data.get("portfolio_projects")
            ),
        ),
        "education": _limit(
            _safe_list(
                structured_analysis.get("education")
                or structured_analysis.get("academic_background")
                or resume_data.get("education")
                or resume_data.get("educations")
            ),
        ),
    }


def _collect_recruiter_view(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect recent recruiter view analysis results
    for career path generation.
    """
    analyses = (
        db.query(RecruiterViewAnalysis)
        .filter(RecruiterViewAnalysis.user_id == user_id)
        .order_by(RecruiterViewAnalysis.analyzed_at.desc())
        .limit(5)
        .all()
    )

    latest = analyses[0] if analyses else None

    return {
        "count": len(analyses),
        "latest_score": latest.recruiter_score if latest else None,
        "latest_analysis": prepare_data(
            _safe_dict(latest.analysis),
        ) if latest else {},
        "recent": [
            {
                "resume_id": item.resume_id,
                "recruiter_score": item.recruiter_score,
                "analysis": prepare_data(
                    _safe_dict(item.analysis),
                ),
                "analyzed_at": _serialize_date(item.analyzed_at),
            }
            for item in analyses
        ],
    }


def _collect_linkedin(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect the user's saved LinkedIn profile
    and latest LinkedIn analysis.
    """
    profile = (
        db.query(LinkedInProfile)
        .filter(LinkedInProfile.user_id == user_id)
        .first()
    )

    if not profile:
        return {}

    return {
        "headline": prepare_data(profile.headline),
        "about": prepare_data(profile.about),
        "skills": prepare_data(profile.skills or []),
        "projects": prepare_data(profile.projects or []),
        "target_role": prepare_data(profile.target_role),
        "latest_profile_score": profile.latest_profile_score,
        "analysis": prepare_data(
            _safe_dict(profile.analysis),
        ),
        "analyzed_at": _serialize_date(profile.analyzed_at),
    }


def _collect_portfolio(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect the user's saved portfolio analysis
    for career path generation.
    """
    profile = (
        db.query(PortfolioProfile)
        .filter(PortfolioProfile.user_id == user_id)
        .first()
    )

    if not profile:
        return {}

    return {
        "github_username": prepare_data(profile.github_username),
        "language": profile.language,
        "analysis": prepare_data(
            _safe_dict(profile.analysis),
        ),
    }


def _collect_applications(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect recent job applications and status counts
    to include application momentum in the roadmap.
    """
    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_date.desc())
        .limit(12)
        .all()
    )

    status_counts: dict[str, int] = {}

    for application in applications:
        status = (application.status or "unknown").lower()
        status_counts[status] = status_counts.get(status, 0) + 1

    return {
        "total_recent": len(applications),
        "status_counts": status_counts,
        "recent": [
            {
                "company_name": prepare_data(application.company_name),
                "job_title": prepare_data(application.job_title),
                "status": application.status,
                "applied_date": _serialize_date(application.applied_date),
                "follow_up_date": _serialize_date(application.follow_up_date),
                "notes": prepare_data(_safe_text(application.notes)),
            }
            for application in applications
        ],
    }


def _collect_interviews(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect recent interview results and feedback
    to include interview readiness in the roadmap.
    """
    results = (
        db.query(InterviewResult)
        .filter(InterviewResult.user_id == user_id)
        .order_by(InterviewResult.created_at.desc())
        .limit(8)
        .all()
    )

    latest = results[0] if results else None

    return {
        "count": len(results),
        "latest": {
            "role": prepare_data(latest.role),
            "mode": latest.mode,
            "difficulty": latest.difficulty,
            "overall_score": latest.overall_score,
            "confidence_score": latest.confidence_score,
            "communication_score": latest.communication_score,
            "structure_score": latest.structure_score,
            "specificity_score": latest.specificity_score,
            "strengths": prepare_data(latest.strengths or []),
            "weaknesses": prepare_data(latest.weaknesses or []),
            "recruiter_insights": prepare_data(latest.recruiter_insights or []),
            "coaching_tips": prepare_data(latest.coaching_tips or []),
            "created_at": _serialize_date(latest.created_at),
        }
        if latest
        else {},
        "recent": [
            {
                "role": prepare_data(item.role),
                "mode": item.mode,
                "difficulty": item.difficulty,
                "overall_score": item.overall_score,
                "confidence_score": item.confidence_score,
                "communication_score": item.communication_score,
                "structure_score": item.structure_score,
                "specificity_score": item.specificity_score,
                "strengths": prepare_data(item.strengths or []),
                "weaknesses": prepare_data(item.weaknesses or []),
                "coaching_tips": prepare_data(item.coaching_tips or []),
                "created_at": _serialize_date(item.created_at),
            }
            for item in results
        ],
    }


def _collect_dashboard(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect the latest dashboard snapshot and review
    as additional career readiness context.
    """
    snapshot = (
        db.query(DashboardSnapshot)
        .filter(DashboardSnapshot.user_id == user_id)
        .order_by(DashboardSnapshot.created_at.desc())
        .first()
    )

    review = (
        db.query(DashboardReview)
        .filter(DashboardReview.user_id == user_id)
        .order_by(DashboardReview.created_at.desc())
        .first()
    )

    return {
        "latest_snapshot": {
            "career_score": snapshot.career_score,
            "recruiter_impression_score": snapshot.recruiter_impression_score,
            "resume_health_score": snapshot.resume_health_score,
            "linkedin_score": snapshot.linkedin_score,
            "portfolio_score": snapshot.portfolio_score,
            "applications_score": snapshot.applications_score,
            "interview_readiness_score": snapshot.interview_readiness_score,
            "summary": prepare_data(snapshot.summary or {}),
            "profile_strength": snapshot.profile_strength or {},
            "career_growth": snapshot.career_growth or [],
            "missing_skills": prepare_data(snapshot.missing_skills or []),
            "skill_gaps": prepare_data(snapshot.skill_gaps or []),
            "next_best_actions": prepare_data(snapshot.next_best_actions or []),
            "weekly_plan": prepare_data(snapshot.weekly_plan or []),
            "created_at": _serialize_date(snapshot.created_at),
        }
        if snapshot
        else {},
        "latest_review": {
            "status": review.status,
            "input_data": prepare_data(review.input_data or {}),
            "result": prepare_data(review.result or {}),
            "created_at": _serialize_date(review.created_at),
        }
        if review
        else {},
    }


def collect_career_path_context(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Build a privacy-safe career context from saved
    Launchly data for AI career path generation.
    """
    return {
        "user_id": user_id,
        "generated_at": datetime.utcnow().isoformat(),
        "resume": _collect_latest_resume(
            db=db,
            user_id=user_id,
        ),
        "recruiter_view": _collect_recruiter_view(
            db=db,
            user_id=user_id,
        ),
        "linkedin": _collect_linkedin(
            db=db,
            user_id=user_id,
        ),
        "portfolio": _collect_portfolio(
            db=db,
            user_id=user_id,
        ),
        "applications": _collect_applications(
            db=db,
            user_id=user_id,
        ),
        "interviews": _collect_interviews(
            db=db,
            user_id=user_id,
        ),
        "dashboard": _collect_dashboard(
            db=db,
            user_id=user_id,
        ),
    }
