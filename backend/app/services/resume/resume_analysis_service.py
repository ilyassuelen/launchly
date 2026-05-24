import json
from datetime import datetime

from openai import AsyncOpenAI
from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.resume.resume import Resume

from backend.app.prompts.resume.resume_analysis_prompts import (
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    build_resume_analysis_prompt,
)

from backend.app.schemas.resume.resume_analysis import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    SmartSuggestion,
    RecruiterAnalysis,
)

from backend.app.services.resume.ats_score_service import (
    calculate_ats_score,
)

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


def _serialize_resume_analysis(
    response: ResumeAnalysisResponse,
) -> dict:
    return {
        "smart_suggestions": [
            suggestion.model_dump()
            for suggestion in response.smart_suggestions
        ],
        "recruiter_analysis": response.recruiter_analysis.model_dump(),
        "ats_score": response.ats_score.model_dump(),
    }


def _save_resume_analysis(
    *,
    db: Session,
    user_id: int,
    resume_id: int,
    analysis: ResumeAnalysisResponse,
) -> None:
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
    )
    resume.analyzed_at = datetime.utcnow()

    db.commit()
    db.refresh(resume)


async def analyze_resume(
    payload: ResumeAnalysisRequest,
    db: Session | None = None,
    user_id: int | None = None,
) -> ResumeAnalysisResponse:
    prompt = build_resume_analysis_prompt(
        tone=payload.tone,
        language=payload.language,
        resume_content=payload.resume_content,
        target_role=payload.target_role or "",
    )

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.4,
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

    content = response.choices[0].message.content

    try:
        parsed = json.loads(content)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response format",
        )

    priority_order = {
        "high": 0,
        "medium": 1,
        "low": 2,
    }

    parsed["smart_suggestions"] = sorted(
        parsed.get("smart_suggestions", []),
        key=lambda x: priority_order.get(
            x.get("priority", "low"),
            2,
        ),
    )[:3]

    ats_score = calculate_ats_score(
        resume_content=payload.resume_content,
        target_role=payload.target_role or "",
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

    if payload.resume_id and db and user_id:
        _save_resume_analysis(
            db=db,
            user_id=user_id,
            resume_id=payload.resume_id,
            analysis=analysis,
        )

    return analysis
