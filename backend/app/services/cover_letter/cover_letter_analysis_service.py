import json

from openai import AsyncOpenAI

from fastapi import HTTPException

from backend.app.core.config import settings

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

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


async def analyze_cover_letter(
    payload: CoverLetterAnalysisRequest,
) -> CoverLetterAnalysisResponse:

    prompt = build_cover_letter_analysis_prompt(
        tone=payload.tone,
        language=payload.language,
        job_posting=payload.job_posting,
        subject=payload.subject,
        body=payload.body,
    )

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

    try:
        parsed = json.loads(content)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response format",
        )

    return CoverLetterAnalysisResponse(
        smart_suggestions=[
            SmartSuggestion(**item)
            for item in parsed.get("smart_suggestions", [])
        ],

        recruiter_analysis=RecruiterAnalysis(
            **parsed.get("recruiter_analysis", {})
        ),
    )
