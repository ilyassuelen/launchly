import json
import logging
from datetime import datetime

from openai import AsyncOpenAI

from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.cover_letter.cover_letter import CoverLetter

from backend.app.prompts.cover_letter.cover_letter_analysis_prompts import (
    COVER_LETTER_ANALYSIS_SYSTEM_PROMPT,
    build_cover_letter_analysis_prompt,
)

from backend.app.schemas.cover_letter.cover_letter_analysis import (
    CoverLetterAnalysisRequest,
    CoverLetterAnalysisResponse,
    SmartSuggestion,
    RecruiterAnalysis,
)
from backend.app.services.privacy.llm_privacy import prepare_data

logger = logging.getLogger(__name__)

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


async def analyze_cover_letter(
    payload: CoverLetterAnalysisRequest,
    db: Session | None = None,
    user_id: int | None = None,
) -> CoverLetterAnalysisResponse:
    """
    Analyze a cover letter from a recruiter perspective
    and generate AI-powered feedback and improvements.
    """

    clean_job_posting = prepare_data(payload.job_posting)
    clean_subject = prepare_data(payload.subject)
    clean_body = prepare_data(payload.body)
    prompt = build_cover_letter_analysis_prompt(
        tone=payload.tone,
        language=payload.language,
        job_posting=clean_job_posting,
        subject=clean_subject,
        body=clean_body,
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.5,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content":
                        COVER_LETTER_ANALYSIS_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        content = response.choices[0].message.content

    except Exception as exc:
        logger.exception(
            "Cover letter analysis request failed",
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze cover letter",
        ) from exc

    try:
        parsed = json.loads(content)

        if not isinstance(parsed, dict):
            logger.error(
                "Cover letter analysis response is not a dictionary: %s",
                parsed,
            )

            raise HTTPException(
                status_code=500,
                detail="Invalid response structure",
            )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception(
            "Failed to parse cover letter analysis response",
        )

        logger.error(
            "Invalid cover letter analysis response content: %s",
            content,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid response format",
        ) from exc

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

    if "recruiter_analysis" not in parsed:
        logger.error(
            "Missing recruiter_analysis in cover letter analysis response: %s",
            parsed,
        )

        raise HTTPException(
            status_code=500,
            detail="Incomplete response",
        )

    analysis = CoverLetterAnalysisResponse(
        smart_suggestions=[
            SmartSuggestion(**item)
            for item in parsed.get("smart_suggestions", [])
        ],
        recruiter_analysis=RecruiterAnalysis(
            **parsed.get("recruiter_analysis", {})
        ),
    )

    if payload.cover_letter_id and db and user_id:
        cover_letter = (
            db.query(CoverLetter)
            .filter(
                CoverLetter.id == payload.cover_letter_id,
                CoverLetter.user_id == user_id,
            )
            .first()
        )

        if not cover_letter:
            raise HTTPException(
                status_code=404,
                detail="Cover letter not found",
            )

        cover_letter.latest_cover_letter_analysis = analysis.model_dump()
        cover_letter.latest_cover_letter_analysis_created_at = datetime.utcnow()

        db.commit()
        db.refresh(cover_letter)

    return analysis
