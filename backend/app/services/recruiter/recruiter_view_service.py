import json
import re
from datetime import datetime

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.resume.resume import Resume
from backend.app.models.recruiter.recruiter import RecruiterViewAnalysis

from backend.app.prompts.recruiter.recruiter_view_prompts import (
    RECRUITER_VIEW_SYSTEM_PROMPT,
    build_recruiter_view_prompt,
)

from backend.app.schemas.recruiter.recruiter_view import (
    RecruiterViewRequest,
    RecruiterViewResponse,
    RecruiterSignal,
    RecruiterFeedbackCard,
)

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


def _serialize_recruiter_view_analysis(
    response: RecruiterViewResponse,
) -> dict:
    return response.model_dump()


def calculate_recruiter_signals(
    resume_content: str,
) -> RecruiterSignal:
    text = (resume_content or "").lower()

    readability = 70
    impact_density = 50
    technical_depth = 50
    visual_hierarchy = 70

    avg_sentence_length = (
        len(text.split()) /
        max(1, len(text.split(".")))
    )

    if avg_sentence_length < 25:
        readability += 15

    if "\n" in text:
        readability += 6

    number_matches = len(
        re.findall(r"\d+", text)
    )

    impact_density += min(
        35,
        number_matches * 4,
    )

    keyword_count = len(
        re.findall(
            r"\b(api|python|excel|sales|marketing|figma|analytics|management|react|finance|fastapi|sql|postgres|typescript|ai|rag|llm)\b",
            text,
        )
    )

    technical_depth += min(
        35,
        keyword_count * 4,
    )

    if "-" in text or "•" in text:
        visual_hierarchy += 10

    if len(text.splitlines()) > 10:
        visual_hierarchy += 10

    return RecruiterSignal(
        readability=max(0, min(100, readability)),
        impact_density=max(0, min(100, impact_density)),
        technical_depth=max(0, min(100, technical_depth)),
        visual_hierarchy=max(0, min(100, visual_hierarchy)),
    )


def save_recruiter_view_analysis(
    *,
    db: Session,
    user_id: int,
    resume_id: int,
    analysis: RecruiterViewResponse,
) -> RecruiterViewAnalysis:
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

    existing_analysis = (
        db.query(RecruiterViewAnalysis)
        .filter(
            RecruiterViewAnalysis.user_id == user_id,
            RecruiterViewAnalysis.resume_id == resume_id,
        )
        .first()
    )

    if not existing_analysis:
        existing_analysis = RecruiterViewAnalysis(
            user_id=user_id,
            resume_id=resume_id,
        )
        db.add(existing_analysis)

    existing_analysis.recruiter_score = analysis.recruiter_score
    existing_analysis.analysis = _serialize_recruiter_view_analysis(
        analysis,
    )
    existing_analysis.analyzed_at = datetime.utcnow()

    db.commit()
    db.refresh(existing_analysis)

    return existing_analysis


def get_saved_recruiter_view_analysis(
    *,
    db: Session,
    user_id: int,
    resume_id: int,
) -> RecruiterViewAnalysis | None:
    return (
        db.query(RecruiterViewAnalysis)
        .filter(
            RecruiterViewAnalysis.user_id == user_id,
            RecruiterViewAnalysis.resume_id == resume_id,
        )
        .first()
    )


async def analyze_recruiter_view(
    payload: RecruiterViewRequest,
    db: Session | None = None,
    user_id: int | None = None,
) -> RecruiterViewResponse:
    prompt = build_recruiter_view_prompt(
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
                "content": RECRUITER_VIEW_SYSTEM_PROMPT,
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
            detail="Invalid recruiter analysis response",
        )

    signals = calculate_recruiter_signals(
        payload.resume_content,
    )

    recruiter_score = int(
        (
            signals.readability +
            signals.impact_density +
            signals.technical_depth +
            signals.visual_hierarchy
        ) / 4
    )

    analysis = RecruiterViewResponse(
        recruiter_score=recruiter_score,
        signals=signals,
        strengths=parsed.get("strengths", [])[:4],
        weak_spots=parsed.get("weak_spots", [])[:4],
        missing_impact=parsed.get("missing_impact", [])[:4],
        ai_feedback=[
            RecruiterFeedbackCard(**item)
            for item in parsed.get("ai_feedback", [])[:3]
        ],
    )

    if payload.resume_id and db and user_id:
        save_recruiter_view_analysis(
            db=db,
            user_id=user_id,
            resume_id=payload.resume_id,
            analysis=analysis,
        )

    return analysis
