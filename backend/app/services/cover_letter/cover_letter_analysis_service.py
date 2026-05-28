import json
import logging

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

logger = logging.getLogger(__name__)

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

    if not isinstance(parsed, dict):
        logger.error(
            "Cover letter analysis response is not a dictionary: %s",
            parsed,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid response structure",
        )

    if "recruiter_analysis" not in parsed:
        logger.error(
            "Missing recruiter_analysis in cover letter analysis response: %s",
            parsed,
        )

        raise HTTPException(
            status_code=500,
            detail="Incomplete response",
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
