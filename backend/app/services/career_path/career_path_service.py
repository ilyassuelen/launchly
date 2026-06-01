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
    """
    Return only dictionary items from a list
    to ensure stable AI response structures.
    """
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    return []


def _safe_text(
    value: Any,
    default: str,
) -> str:
    if isinstance(value, str) and value.strip():
        return value.strip()

    return default


def _safe_string_list(
    value: Any,
    fallback: list[str],
) -> list[str]:
    if not isinstance(value, list):
        return fallback

    items = [
        str(item).strip()
        for item in value
        if str(item).strip()
    ]

    return items or fallback


def _safe_int(value: Any, default: int = 70, minimum: int = 0, maximum: int = 100) -> int:
    """
    Safely convert a value into a bounded integer
    with configurable fallback limits.
    """
    try:
        number = int(value)
        return max(minimum, min(maximum, number))
    except (TypeError, ValueError):
        return default


def _safe_role_fit(value: Any, default: str = "medium") -> str:
    """
    Normalize the AI-generated role fit value
    to a supported confidence category.
    """
    if not isinstance(value, str):
        return default

    normalized = value.strip().lower()

    if normalized in ["high", "medium", "low", "very_low"]:
        return normalized

    return default


def _fallback_payload(request: CareerPathGenerateRequest) -> dict[str, Any]:
    """
    Generate a stable fallback career roadmap
    when AI generation is unavailable or invalid.
    """
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


def _normalize_milestone(
    item: dict[str, Any],
    fallback: dict[str, Any],
) -> dict[str, Any]:
    return {
        "title": _safe_text(item.get("title"), fallback["title"]),
        "description": _safe_text(item.get("description"), fallback["description"]),
        "timeframe": _safe_text(item.get("timeframe"), fallback["timeframe"]),
        "priority": _safe_text(item.get("priority"), fallback["priority"]),
        "tasks": _safe_string_list(item.get("tasks"), fallback["tasks"]),
    }


def _normalize_skill_gap(
    item: dict[str, Any],
    fallback: dict[str, Any],
) -> dict[str, Any]:
    return {
        "skill": _safe_text(item.get("skill"), fallback["skill"]),
        "current_level": _safe_text(item.get("current_level"), fallback["current_level"]),
        "target_level": _safe_text(item.get("target_level"), fallback["target_level"]),
        "reason": _safe_text(item.get("reason"), fallback["reason"]),
        "priority": _safe_text(item.get("priority"), fallback["priority"]),
    }


def _normalize_learning_item(
    item: dict[str, Any],
    fallback: dict[str, Any],
) -> dict[str, Any]:
    return {
        "title": _safe_text(item.get("title"), fallback["title"]),
        "description": _safe_text(item.get("description"), fallback["description"]),
        "type": _safe_text(item.get("type"), fallback["type"]),
        "estimated_time": _safe_text(item.get("estimated_time"), fallback["estimated_time"]),
        "priority": _safe_text(item.get("priority"), fallback["priority"]),
    }


def _normalize_project_item(
    item: dict[str, Any],
    fallback: dict[str, Any],
) -> dict[str, Any]:
    return {
        "title": _safe_text(item.get("title"), fallback["title"]),
        "description": _safe_text(item.get("description"), fallback["description"]),
        "skills_practiced": _safe_string_list(
            item.get("skills_practiced"),
            fallback["skills_practiced"],
        ),
        "portfolio_value": _safe_text(item.get("portfolio_value"), fallback["portfolio_value"]),
        "difficulty": _safe_text(item.get("difficulty"), fallback["difficulty"]),
    }


def _normalize_application_strategy_item(
    item: dict[str, Any],
    fallback: dict[str, Any],
) -> dict[str, Any]:
    return {
        "title": _safe_text(item.get("title"), fallback["title"]),
        "description": _safe_text(item.get("description"), fallback["description"]),
        "action_items": _safe_string_list(
            item.get("action_items"),
            fallback["action_items"],
        ),
    }


def _normalize_payload(
    raw_payload: dict[str, Any],
    request: CareerPathGenerateRequest,
) -> dict[str, Any]:
    """
    Validate and normalize the AI-generated
    career roadmap response structure.
    """
    fallback = _fallback_payload(request)

    raw_roadmap = _safe_list(raw_payload.get("roadmap"))
    raw_skill_gaps = _safe_list(raw_payload.get("skill_gaps"))
    raw_learning_plan = _safe_list(raw_payload.get("learning_plan"))
    raw_project_plan = _safe_list(raw_payload.get("project_plan"))
    raw_application_strategy = _safe_list(
        raw_payload.get("application_strategy"),
    )

    return {
        "summary": _safe_text(
            raw_payload.get("summary"),
            fallback["summary"],
        ),
        "confidence_score": _safe_int(
            raw_payload.get("confidence_score"),
            default=fallback["confidence_score"],
        ),
        "role_fit": _safe_role_fit(
            raw_payload.get("role_fit"),
            default=fallback["role_fit"],
        ),
        "role_fit_summary": _safe_text(
            raw_payload.get("role_fit_summary"),
            fallback["role_fit_summary"],
        ),
        "roadmap": [
            _normalize_milestone(
                item,
                fallback["roadmap"][
                    min(index, len(fallback["roadmap"]) - 1)
                ],
            )
            for index, item in enumerate(raw_roadmap)
        ] or fallback["roadmap"],
        "skill_gaps": [
            _normalize_skill_gap(
                item,
                fallback["skill_gaps"][
                    min(index, len(fallback["skill_gaps"]) - 1)
                ],
            )
            for index, item in enumerate(raw_skill_gaps)
        ] or fallback["skill_gaps"],
        "learning_plan": [
            _normalize_learning_item(
                item,
                fallback["learning_plan"][
                    min(index, len(fallback["learning_plan"]) - 1)
                ],
            )
            for index, item in enumerate(raw_learning_plan)
        ] or fallback["learning_plan"],
        "project_plan": [
            _normalize_project_item(
                item,
                fallback["project_plan"][
                    min(index, len(fallback["project_plan"]) - 1)
                ],
            )
            for index, item in enumerate(raw_project_plan)
        ] or fallback["project_plan"],
        "application_strategy": [
            _normalize_application_strategy_item(
                item,
                fallback["application_strategy"][
                    min(index, len(fallback["application_strategy"]) - 1)
                ],
            )
            for index, item in enumerate(raw_application_strategy)
        ] or fallback["application_strategy"],
    }


async def _generate_ai_payload(
    request: CareerPathGenerateRequest,
    career_context: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate a structured AI career roadmap
    using the collected user career context.
    """
    if not settings.OPENAI_API_KEY:
        logger.warning(
            "Career path generation using fallback because OPENAI_API_KEY is missing target_role=%s",
            request.target_role,
        )
        fallback = _fallback_payload(request)
        fallback["generation_mode"] = "fallback"
        return fallback

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

        content = (
                response.choices[0].message.content
                or ""
        ).strip()

        if not content:
            logger.error(
                "Career path AI response was empty target_role=%s",
                request.target_role,
            )

            fallback = _fallback_payload(request)
            fallback["generation_mode"] = "fallback"
            return fallback

        try:
            parsed = json.loads(content)
        except Exception:
            logger.exception(
                "Career path JSON parsing failed target_role=%s response_preview=%s",
                request.target_role,
                content[:500],
            )
            fallback = _fallback_payload(request)
            fallback["generation_mode"] = "fallback"
            return fallback

        if not isinstance(parsed, dict):
            logger.error(
                "Career path response is not a dictionary target_role=%s response_type=%s",
                request.target_role,
                type(parsed).__name__,
            )
            fallback = _fallback_payload(request)
            fallback["generation_mode"] = "fallback"
            return fallback

        payload = _normalize_payload(parsed, request)
        payload["generation_mode"] = "ai"
        return payload

    except Exception:
        logger.exception(
            "Career path AI request failed target_role=%s current_level=%s timeframe_months=%s",
            request.target_role,
            request.current_level,
            request.timeframe_months,
        )
        fallback = _fallback_payload(request)
        fallback["generation_mode"] = "fallback"
        return fallback


async def generate_career_path(
    db: Session,
    user_id: int,
    request: CareerPathGenerateRequest,
) -> CareerPath:
    """
    Generate, store and return a personalized
    AI-powered career roadmap for the user.
    """
    career_context = collect_career_path_context(
        db=db,
        user_id=user_id,
    )

    payload = await _generate_ai_payload(
        request=request,
        career_context=career_context,
    )

    input_snapshot = {
        "generation_mode": payload.get("generation_mode", "ai"),
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
        status=(
            "fallback"
            if payload.get("generation_mode") == "fallback"
            else "completed"
        ),
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
    """
    Return all saved career paths
    for the selected user.
    """
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
    """
    Return the most recently generated
    career path for the user.
    """
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
    """
    Return a specific user-owned
    career path by its ID.
    """
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
    """
    Delete a user-owned career path
    and return whether it existed.
    """
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
