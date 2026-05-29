from datetime import datetime, timedelta
from typing import Any

from sqlalchemy.orm import Session

from backend.app.models.resume.resume import Resume
from backend.app.models.recruiter.recruiter import RecruiterViewAnalysis
from backend.app.models.linkedin.linkedin_profile import LinkedInProfile
from backend.app.models.portfolio.portfolio_profile import PortfolioProfile
from backend.app.models.applications.application import Application
from backend.app.models.dashboard.dashboard_snapshot import DashboardSnapshot
from backend.app.models.interview.interview_result import InterviewResult


def _safe_int(value: Any) -> int:
    try:
        if value is None:
            return 0

        return int(value)
    except Exception:
        return 0


def _extract_portfolio_score(profile: PortfolioProfile | None) -> int:
    """
    Extract the best available portfolio score
    from the profile or its stored analysis payload.
    """
    if not profile:
        return 0

    direct_score = getattr(profile, "portfolio_score", None)

    if direct_score is not None:
        return _safe_int(direct_score)

    analysis = getattr(profile, "analysis", None)

    if not isinstance(analysis, dict):
        return 0

    for key in [
        "portfolio_score",
        "overall_score",
        "score",
    ]:
        if key in analysis:
            return _safe_int(analysis.get(key))

    return 0


def _get_latest_portfolio_profile(
    db: Session,
    user_id: int,
) -> PortfolioProfile | None:
    """
    Return the latest portfolio profile using the
    best available timestamp or ID ordering.
    """
    query = (
        db.query(PortfolioProfile)
        .filter(PortfolioProfile.user_id == user_id)
    )

    if hasattr(PortfolioProfile, "updated_at"):
        query = query.order_by(PortfolioProfile.updated_at.desc())
    elif hasattr(PortfolioProfile, "created_at"):
        query = query.order_by(PortfolioProfile.created_at.desc())
    else:
        query = query.order_by(PortfolioProfile.id.desc())

    return query.first()


def collect_dashboard_data(
    *,
    db: Session,
    user_id: int,
    language: str,
) -> dict:
    """
    Collect the latest user data needed to calculate
    dashboard scores and generate dashboard insights.
    """
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=7)

    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(
            Resume.analyzed_at.desc().nullslast(),
            Resume.updated_at.desc(),
            Resume.created_at.desc(),
        )
        .all()
    )

    recruiter_analyses = (
        db.query(RecruiterViewAnalysis)
        .filter(RecruiterViewAnalysis.user_id == user_id)
        .order_by(RecruiterViewAnalysis.id.desc())
        .all()
    )

    linkedin_profile = (
        db.query(LinkedInProfile)
        .filter(LinkedInProfile.user_id == user_id)
        .first()
    )

    portfolio_profile = _get_latest_portfolio_profile(
        db=db,
        user_id=user_id,
    )

    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .all()
    )

    latest_snapshot = (
        db.query(DashboardSnapshot)
        .filter(
            DashboardSnapshot.user_id == user_id,
            DashboardSnapshot.language == language,
        )
        .order_by(DashboardSnapshot.created_at.desc())
        .first()
    )

    latest_interview_result = (
        db.query(InterviewResult)
        .filter(InterviewResult.user_id == user_id)
        .order_by(InterviewResult.created_at.desc())
        .first()
    )

    interview_results = (
        db.query(InterviewResult)
        .filter(InterviewResult.user_id == user_id)
        .all()
    )

    interview_scores = [
        _safe_int(result.overall_score)
        for result in interview_results
        if result.overall_score is not None
    ]

    resume_scores = [
        _safe_int(resume.latest_ats_score)
        for resume in resumes
        if resume.latest_ats_score is not None
    ]

    recruiter_scores = [
        _safe_int(item.recruiter_score)
        for item in recruiter_analyses
        if item.recruiter_score is not None
    ]

    linkedin_analysis = (
        linkedin_profile.analysis
        if linkedin_profile and isinstance(linkedin_profile.analysis, dict)
        else None
    )

    linkedin_score = (
        _safe_int(linkedin_analysis.get("profile_score"))
        if linkedin_analysis
        else 0
    )

    portfolio_score = _extract_portfolio_score(portfolio_profile)

    weekly_applications = [
        application
        for application in applications
        if application.applied_date
        and application.applied_date >= week_start
    ]

    active_applications = [
        application
        for application in applications
        if (application.status or "").lower() != "rejected"
    ]

    recent_applications = sorted(
        applications,
        key=lambda item: item.applied_date or today,
        reverse=True,
    )[:4]

    return {
        "user_id": user_id,
        "generated_at": datetime.utcnow().isoformat(),
        "resume": {
            "count": len(resumes),
            "scores": resume_scores,
            "latest_score": resume_scores[0] if resume_scores else 0,
        },
        "recruiter_view": {
            "count": len(recruiter_analyses),
            "scores": recruiter_scores,
            "latest_score": recruiter_scores[0] if recruiter_scores else 0,
        },
        "linkedin": {
            "score": linkedin_score,
            "headline": linkedin_profile.headline if linkedin_profile else "",
            "target_role": linkedin_profile.target_role if linkedin_profile else "",
            "skills": linkedin_profile.skills if linkedin_profile else [],
            "analysis": linkedin_analysis or {},
        },
        "portfolio": {
            "score": portfolio_score,
            "analysis": getattr(portfolio_profile, "analysis", {}) or {},
        },
        "applications": {
            "total": len(applications),
            "active": len(active_applications),
            "this_week": len(weekly_applications),
            "recent": [
                {
                    "company_name": application.company_name,
                    "job_title": application.job_title,
                    "status": application.status,
                    "date_label": (
                        application.applied_date.isoformat()
                        if application.applied_date
                        else None
                    ),
                }
                for application in recent_applications
            ],
            "activity": [
                {
                    "date_label": (
                        application.applied_date.isoformat()
                        if application.applied_date
                        else None
                    ),
                    "status": application.status,
                }
                for application in applications
            ],
        },
        "previous_snapshot": {
            "career_score": latest_snapshot.career_score if latest_snapshot else 0,
            "created_at": latest_snapshot.created_at.isoformat()
            if latest_snapshot
            else None,
        },
        "interview": {
            "count": len(interview_results),
            "scores": interview_scores,
            "latest_score": latest_interview_result.overall_score
            if latest_interview_result
            else 0,
        },
    }
