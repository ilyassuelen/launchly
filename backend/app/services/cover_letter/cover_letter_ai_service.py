import json
import logging

from openai import AsyncOpenAI
from fastapi import HTTPException

from backend.app.core.config import settings

from backend.app.prompts.cover_letter.cover_letter_prompts import (
    COVER_LETTER_SYSTEM_PROMPT,
    build_cover_letter_prompt,
)

from backend.app.schemas.cover_letter.cover_letter_ai import (
    CoverLetterGenerateRequest,
    CoverLetterGenerateResponse,
)

from backend.app.services.privacy.llm_privacy import prepare_data

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)

logger = logging.getLogger(__name__)


async def generate_cover_letter(
    payload: CoverLetterGenerateRequest,
) -> CoverLetterGenerateResponse:

    clean_sender_name = prepare_data(payload.sender_name)
    clean_current_role = prepare_data(payload.current_role)
    clean_skills = prepare_data(payload.skills)
    clean_resume_context = prepare_data(payload.resume_context)
    clean_job_posting = prepare_data(payload.job_posting)

    hiring_contact = getattr(
        payload,
        "hiring_contact",
        "",
    )

    prompt = build_cover_letter_prompt(
        language=payload.language,
        tone=payload.tone,
        sender_name=clean_sender_name,
        current_role=clean_current_role,
        skills=clean_skills,
        resume_context=clean_resume_context,
        job_posting=clean_job_posting,
        hiring_contact=hiring_contact,
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content": COVER_LETTER_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
    except Exception as exc:
        logger.exception(
            "Cover letter AI request failed for sender_name=%s current_role=%s",
            payload.sender_name,
            payload.current_role,
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to generate cover letter",
        ) from exc

    content = response.choices[0].message.content

    try:
        parsed = json.loads(content)
    except Exception as exc:
        logger.exception(
            "Cover letter JSON parsing failed response_preview=%s",
            content[:500] if content else "",
        )
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response format",
        ) from exc

    if not isinstance(parsed, dict):
        logger.error(
            "Cover letter AI returned non-dict response type=%s",
            type(parsed).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response structure",
        )

    if "subject" not in parsed or "body" not in parsed:
        logger.error(
            "Cover letter AI response missing required fields keys=%s",
            list(parsed.keys()),
        )
        raise HTTPException(
            status_code=500,
            detail="Incomplete response",
        )

    return CoverLetterGenerateResponse(
        subject=parsed["subject"],
        body=parsed["body"],
    )
