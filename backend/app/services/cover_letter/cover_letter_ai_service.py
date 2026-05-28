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

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)

logger = logging.getLogger(__name__)


async def generate_cover_letter(
    payload: CoverLetterGenerateRequest,
) -> CoverLetterGenerateResponse:

    prompt = build_cover_letter_prompt(
        language=payload.language,
        tone=payload.tone,
        sender_name=payload.sender_name,
        current_role=payload.current_role,
        skills=payload.skills,
        resume_context=payload.resume_context,
        job_posting=payload.job_posting,
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
