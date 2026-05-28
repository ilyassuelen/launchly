import json
import logging
from typing import Any, Optional

from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.models.career_path.career_path import CareerPath
from backend.app.schemas.career_path.career_path import CareerPathGenerateRequest
from backend.app.prompts.career_path.career_path_prompts import (
    CAREER_PATH_SYSTEM_PROMPT,
    build_career_path_prompt,
)

from backend.app.services.career_path.career_path_data_collector import (
    collect_career_path_context,
)

logger = logging.getLogger(__name__)


def _safe_list(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    return []



def _safe_int(value: Any, default: int = 70, minimum: int = 0, maximum: int = 100) -> int:
    try:
        number = int(value)
        return max(minimum, min(maximum, number))
    except (TypeError, ValueError):
        return default


# Helper to safely normalize role_fit field
def _safe_role_fit(value: Any, default: str = "medium") -> str:
    if not isinstance(value, str):
        return default

    normalized = value.strip().lower()

    if normalized in ["high", "medium", "low", "very_low"]:
        return normalized

    return default


def _fallback_payload(request: CareerPathGenerateRequest) -> dict[str, Any]:
    target_role = request.target_role

    return {
        "summary": (
            f"A practical roadmap to move toward a {target_role} role. "
            "The plan uses available profile data and focuses on job-relevant skills, "
            "portfolio proof, interview readiness, and stronger applications."
        ),
        "confidence_score": 72,
        "role_fit": "medium",
        "role_fit_summary": (
            "Your saved profile data provides some useful signals, but the target-role fit "
            "should be validated against your real skills, projects, education and application history."
        ),
        "roadmap": [
            {
                "title": "Review your current career profile",
                "description": f"Use your saved Launchly data to understand how close you are to a {target_role} role.",
                "timeframe": "Week 1",
                "priority": "high",
                "tasks": [
                    "Review resume score and recruiter feedback",
                    "Check LinkedIn and portfolio analysis",
                    "Identify repeated weaknesses across tools",
                ],
            },
            {
                "title": "Close the most important skill gaps",
                "description": "Prioritize gaps that appear across your resume, interviews, portfolio, and dashboard insights.",
                "timeframe": "Weeks 2-6",
                "priority": "high",
                "tasks": [
                    "Choose 2-3 high-impact technical gaps",
                    "Practice them through small focused exercises",
                    "Update your resume and portfolio with stronger evidence",
                ],
            },
            {
                "title": "Build stronger portfolio proof",
                "description": "Create projects that directly support your target role and make your skills easier to verify.",
                "timeframe": "Weeks 6-12",
                "priority": "high",
                "tasks": [
                    "Improve one existing portfolio project",
                    "Add a clear README with architecture notes",
                    "Show measurable impact and technical decisions",
                ],
            },
            {
                "title": "Improve interview readiness",
                "description": "Use interview simulator feedback to strengthen communication, structure, and specificity.",
                "timeframe": "Weeks 8-14",
                "priority": "medium",
                "tasks": [
                    "Repeat interview simulations weekly",
                    "Prepare project-based STAR stories",
                    "Practice explaining technical tradeoffs clearly",
                ],
            },
            {
                "title": "Apply with a focused strategy",
                "description": "Use your application history and profile strengths to target better-fit roles.",
                "timeframe": "Ongoing",
                "priority": "medium",
                "tasks": [
                    "Prioritize jobs aligned with your strongest proof",
                    "Customize resume bullets per job description",
                    "Track follow-ups and application outcomes",
                ],
            },
        ],
        "skill_gaps": [
            {
                "skill": "Role-specific proof",
                "current_level": request.current_level or "unknown",
                "target_level": "job-ready",
                "reason": "Your profile needs visible evidence that matches the target role.",
                "priority": "high",
            },
            {
                "skill": "Portfolio positioning",
                "current_level": "developing",
                "target_level": "strong",
                "reason": "Recruiters need to quickly understand your practical ability.",
                "priority": "high",
            },
            {
                "skill": "Interview specificity",
                "current_level": "developing",
                "target_level": "confident",
                "reason": "Strong answers need concrete examples, decisions, and outcomes.",
                "priority": "medium",
            },
        ],
        "learning_plan": [
            {
                "title": "Profile gap review",
                "description": "Compare your resume, portfolio, LinkedIn, and interview feedback to identify repeated gaps.",
                "type": "practice",
                "estimated_time": "2-3 days",
                "priority": "high",
            },
            {
                "title": "Project-based skill sprint",
                "description": "Learn by improving or building a project connected to your target role.",
                "type": "project",
                "estimated_time": "2-4 weeks",
                "priority": "high",
            },
        ],
        "project_plan": [
            {
                "title": f"{target_role} proof project",
                "description": "Build or upgrade a focused project that demonstrates the main skills required for the role.",
                "skills_practiced": ["architecture", "implementation", "documentation"],
                "portfolio_value": "Shows practical ability and makes your application stronger.",
                "difficulty": "medium",
            },
        ],
        "application_strategy": [
            {
                "title": "Targeted application workflow",
                "description": "Apply with profile evidence instead of generic applications.",
                "action_items": [
                    "Prioritize roles that match your strongest skills",
                    "Adapt resume bullets to each job description",
                    "Use portfolio projects as proof in applications",
                ],
            },
        ],
    }


def _normalize_payload(
    raw_payload: dict[str, Any],
    request: CareerPathGenerateRequest,
) -> dict[str, Any]:
    fallback = _fallback_payload(request)

    return {
        "summary": raw_payload.get("summary") or fallback["summary"],
        "confidence_score": _safe_int(
            raw_payload.get("confidence_score"),
            default=fallback["confidence_score"],
        ),
        "role_fit": _safe_role_fit(
            raw_payload.get("role_fit"),
            default=fallback["role_fit"],
        ),
        "role_fit_summary": (
            raw_payload.get("role_fit_summary")
            if isinstance(raw_payload.get("role_fit_summary"), str)
            and raw_payload.get("role_fit_summary", "").strip()
            else fallback["role_fit_summary"]
        ),
        "roadmap": _safe_list(raw_payload.get("roadmap")) or fallback["roadmap"],
        "skill_gaps": _safe_list(raw_payload.get("skill_gaps")) or fallback["skill_gaps"],
        "learning_plan": _safe_list(raw_payload.get("learning_plan")) or fallback["learning_plan"],
        "project_plan": _safe_list(raw_payload.get("project_plan")) or fallback["project_plan"],
        "application_strategy": (
            _safe_list(raw_payload.get("application_strategy"))
            or fallback["application_strategy"]
        ),
    }


async def _generate_ai_payload(
    request: CareerPathGenerateRequest,
    career_context: dict[str, Any],
) -> dict[str, Any]:
    if not settings.OPENAI_API_KEY:
        logger.warning(
            "Career path generation using fallback because OPENAI_API_KEY is missing target_role=%s",
            request.target_role,
        )
        return _fallback_payload(request)

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = build_career_path_prompt(
        language=request.language,
        target_role=request.target_role,
        current_level=request.current_level,
        timeframe_months=request.timeframe_months,
        career_context=career_context,
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.35,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content": CAREER_PATH_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        content = response.choices[0].message.content or "{}"

        try:
            parsed = json.loads(content)
        except Exception:
            logger.exception(
                "Career path JSON parsing failed target_role=%s response_preview=%s",
                request.target_role,
                content[:500],
            )
            return _fallback_payload(request)

        if not isinstance(parsed, dict):
            logger.error(
                "Career path response is not a dictionary target_role=%s response_type=%s",
                request.target_role,
                type(parsed).__name__,
            )
            return _fallback_payload(request)

        return _normalize_payload(parsed, request)

    except Exception:
        logger.exception(
            "Career path AI request failed target_role=%s current_level=%s timeframe_months=%s",
            request.target_role,
            request.current_level,
            request.timeframe_months,
        )
        return _fallback_payload(request)


async def generate_career_path(
    db: Session,
    user_id: int,
    request: CareerPathGenerateRequest,
) -> CareerPath:
    career_context = collect_career_path_context(
        db=db,
        user_id=user_id,
    )

    payload = await _generate_ai_payload(
        request=request,
        career_context=career_context,
    )

    input_snapshot = {
        "request": {
            "target_role": request.target_role,
            "current_level": request.current_level,
            "timeframe_months": request.timeframe_months,
            "language": request.language,
        },
        "career_context": career_context,
    }

    career_path = CareerPath(
        user_id=user_id,
        target_role=request.target_role,
        current_level=request.current_level,
        timeframe_months=request.timeframe_months,
        input_snapshot=input_snapshot,
        roadmap=payload["roadmap"],
        skill_gaps=payload["skill_gaps"],
        learning_plan=payload["learning_plan"],
        project_plan=payload["project_plan"],
        application_strategy=payload["application_strategy"],
        summary=payload["summary"],
        confidence_score=payload["confidence_score"],
        role_fit=payload["role_fit"],
        role_fit_summary=payload["role_fit_summary"],
        status="completed",
    )

    try:
        db.add(career_path)
        db.commit()
        db.refresh(career_path)
    except Exception:
        db.rollback()
        logger.exception(
            "Failed to persist career path user_id=%s target_role=%s",
            user_id,
            request.target_role,
        )
        raise

    return career_path


def get_user_career_paths(
    db: Session,
    user_id: int,
) -> list[CareerPath]:
    return (
        db.query(CareerPath)
        .filter(CareerPath.user_id == user_id)
        .order_by(CareerPath.created_at.desc())
        .all()
    )


def get_latest_career_path(
    db: Session,
    user_id: int,
) -> Optional[CareerPath]:
    return (
        db.query(CareerPath)
        .filter(CareerPath.user_id == user_id)
        .order_by(CareerPath.created_at.desc())
        .first()
    )


def get_career_path_by_id(
    db: Session,
    user_id: int,
    career_path_id: int,
) -> Optional[CareerPath]:
    return (
        db.query(CareerPath)
        .filter(
            CareerPath.id == career_path_id,
            CareerPath.user_id == user_id,
        )
        .first()
    )


def delete_career_path(
    db: Session,
    user_id: int,
    career_path_id: int,
) -> bool:
    career_path = get_career_path_by_id(
        db=db,
        user_id=user_id,
        career_path_id=career_path_id,
    )

    if not career_path:
        return False

    db.delete(career_path)
    db.commit()

    return True
