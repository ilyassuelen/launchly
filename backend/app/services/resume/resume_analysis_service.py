import json
import logging
from datetime import datetime
from typing import Any

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.models.resume.resume import Resume

from backend.app.prompts.resume.resume_analysis_prompts import (
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    build_resume_analysis_prompt,
)

from backend.app.schemas.resume.resume_analysis import (
    RecruiterAnalysis,
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    SmartSuggestion,
)

from backend.app.services.resume.ats_score_service import (
    calculate_ats_score,
)
from backend.app.services.privacy.llm_privacy import prepare_data


client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)

logger = logging.getLogger(__name__)


STRUCTURED_RESUME_KEYS = [
    "summary",
    "candidate_summary",
    "professional_summary",
    "profile_summary",
    "resume_summary",
    "skills",
    "detected_skills",
    "core_skills",
    "key_skills",
    "technical_skills",
    "professional_skills",
    "soft_skills",
    "hard_skills",
    "transferable_skills",
    "domain_skills",
    "tools",
    "software",
    "platforms",
    "systems",
    "technologies",
    "tech_stack",
    "projects",
    "project_experience",
    "portfolio_projects",
    "case_studies",
    "work_samples",
    "experience",
    "work_experience",
    "employment_history",
    "professional_experience",
    "career_history",
    "responsibilities",
    "tasks",
    "duties",
    "role_responsibilities",
    "key_responsibilities",
    "education",
    "studies",
    "academic_background",
    "certifications",
    "certificates",
    "licenses",
    "courses",
    "achievements",
    "accomplishments",
    "impact",
    "results",
    "outcomes",
    "highlights",
    "awards",
    "industries",
    "domains",
    "sectors",
    "keywords",
    "ats_keywords",
    "role_keywords",
    "resume_keywords",
    "target_roles",
    "desired_roles",
    "job_titles",
    "candidate_level",
    "seniority",
    "experience_level",
]


PRIORITY_ORDER = {
    "high": 0,
    "medium": 1,
    "low": 2,
}


def _safe_dict(value: Any) -> dict:
    if isinstance(value, dict):
        return value

    return {}


def _safe_list(value: Any) -> list:
    if isinstance(value, list):
        return [
            item
            for item in value
            if item not in [None, "", [], {}]
        ]

    return []


def _safe_string(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip()


def _normalize_priority(value: Any) -> str:
    """
    Normalize an AI-provided priority value to one
    of the supported priority levels.
    """
    priority = _safe_string(value).lower()

    if priority in PRIORITY_ORDER:
        return priority

    return "low"


def _normalize_smart_suggestion(item: Any) -> dict | None:
    """
    Validate and normalize one AI-generated suggestion
    so the response always has a title, description and
    supported priority value.
    """
    if not isinstance(item, dict):
        return None

    title = _safe_string(item.get("title"))
    description = _safe_string(item.get("description"))

    if not title or not description:
        return None

    return {
        **item,
        "title": title,
        "description": description,
        "priority": _normalize_priority(item.get("priority")),
    }


def _normalize_smart_suggestions(parsed: dict) -> list[dict]:
    """
    Clean, sort and limit AI-generated resume suggestions
    before converting them into response schemas.
    """
    suggestions = [
        suggestion
        for suggestion in [
            _normalize_smart_suggestion(item)
            for item in _safe_list(parsed.get("smart_suggestions"))
        ]
        if suggestion is not None
    ]

    return sorted(
        suggestions,
        key=lambda item: PRIORITY_ORDER.get(
            item.get("priority", "low"),
            2,
        ),
    )[:3]


def _extract_structured_resume_data(
        *,
        parsed: dict,
        payload: ResumeAnalysisRequest
) -> dict:
    """
    Extract useful structured resume information from the
    AI response so other features can reuse it later.
    """
    structured = {}

    for key in STRUCTURED_RESUME_KEYS:
        value = parsed.get(key)

        if value not in [None, "", [], {}]:
            structured[key] = value

    recruiter_analysis = _safe_dict(parsed.get("recruiter_analysis"))

    for key in STRUCTURED_RESUME_KEYS:
        value = recruiter_analysis.get(key)

        if value not in [None, "", [], {}] and key not in structured:
            structured[key] = value

    structured["target_role"] = payload.target_role or ""
    structured["language"] = payload.language
    structured["tone"] = payload.tone
    structured["resume_content_preview"] = payload.resume_content[:1200]

    return structured


def _serialize_resume_analysis(
    response: ResumeAnalysisResponse,
    *,
    raw_analysis: dict | None = None,
    structured_resume_data: dict | None = None,
) -> dict:
    """
    Convert the validated analysis response into a JSON-safe
    dictionary for storing it on the resume record.
    """
    serialized = {
        "smart_suggestions": [
            suggestion.model_dump()
            for suggestion in response.smart_suggestions
        ],
        "recruiter_analysis": response.recruiter_analysis.model_dump(),
        "ats_score": response.ats_score.model_dump(),
    }

    if structured_resume_data:
        serialized.update(structured_resume_data)
        serialized["structured_resume_data"] = structured_resume_data

    if raw_analysis:
        serialized["raw_ai_analysis"] = raw_analysis

    return serialized


def _save_resume_analysis(
    *,
    db: Session,
    user_id: int,
    resume_id: int,
    analysis: ResumeAnalysisResponse,
    raw_analysis: dict | None = None,
    structured_resume_data: dict | None = None,
) -> None:
    """
    Save the latest ATS score and resume analysis result
    on the matching user-owned resume.
    """
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user_id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    resume.latest_ats_score = analysis.ats_score.score
    resume.latest_resume_analysis = _serialize_resume_analysis(
        analysis,
        raw_analysis=raw_analysis,
        structured_resume_data=structured_resume_data,
    )
    resume.analyzed_at = datetime.utcnow()

    db.commit()
    db.refresh(resume)


async def analyze_resume(
    payload: ResumeAnalysisRequest,
    db: Session | None = None,
    user_id: int | None = None,
) -> ResumeAnalysisResponse:
    """
    Run an AI resume analysis, calculate the local ATS score,
    and optionally persist the result for the selected resume.
    """
    clean_resume_content = prepare_data(payload.resume_content)
    clean_target_role = prepare_data(payload.target_role or "")

    prompt = build_resume_analysis_prompt(
        tone=payload.tone,
        language=payload.language,
        resume_content=clean_resume_content,
        target_role=clean_target_role,
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
                    "content": RESUME_ANALYSIS_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
    except Exception as exc:
        logger.exception(
            "Resume analysis AI request failed for user_id=%s resume_id=%s target_role=%s",
            user_id,
            payload.resume_id,
            payload.target_role,
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze resume",
        ) from exc

    content = response.choices[0].message.content or "{}"

    try:
        parsed = json.loads(content)
    except Exception as exc:
        logger.exception(
            "Resume analysis JSON parsing failed for user_id=%s resume_id=%s response_preview=%s",
            user_id,
            payload.resume_id,
            content[:500],
        )
        raise HTTPException(
            status_code=500,
            detail="Invalid response format",
        ) from exc

    parsed = _safe_dict(parsed)
    parsed["smart_suggestions"] = _normalize_smart_suggestions(
        parsed,
    )

    ats_score = calculate_ats_score(
        resume_content=clean_resume_content,
        target_role=clean_target_role,
    )

    analysis = ResumeAnalysisResponse(
        smart_suggestions=[
            SmartSuggestion(**item)
            for item in parsed.get("smart_suggestions", [])
        ],
        recruiter_analysis=RecruiterAnalysis(
            **parsed.get("recruiter_analysis", {})
        ),
        ats_score=ats_score,
    )

    structured_resume_data = _extract_structured_resume_data(
        parsed=parsed,
        payload=payload,
    )

    if payload.resume_id and db and user_id:
        try:
            _save_resume_analysis(
                db=db,
                user_id=user_id,
                resume_id=payload.resume_id,
                analysis=analysis,
                raw_analysis=parsed,
                structured_resume_data=structured_resume_data,
            )
        except HTTPException:
            raise
        except Exception as exc:
            logger.exception(
                "Failed to persist resume analysis for user_id=%s resume_id=%s",
                user_id,
                payload.resume_id,
            )
            raise HTTPException(
                status_code=500,
                detail="Failed to save resume analysis",
            ) from exc

    return analysis
