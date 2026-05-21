import json

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

    content = response.choices[0].message.content

    try:
        parsed = json.loads(content)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response format",
        )

    return CoverLetterGenerateResponse(
        subject=parsed["subject"],
        body=parsed["body"],
    )
