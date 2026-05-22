import json

from openai import AsyncOpenAI
from fastapi import HTTPException

from backend.app.core.config import settings

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

from backend.app.services.resume.ats_score_service import calculate_ats_score

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


async def analyze_resume(
    payload: ResumeAnalysisRequest,
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

    return ResumeAnalysisResponse(
        smart_suggestions=[
            SmartSuggestion(**item)
            for item in parsed.get("smart_suggestions", [])
        ],

        recruiter_analysis=RecruiterAnalysis(
            **parsed.get("recruiter_analysis", {})
        ),

        ats_score=ats_score,
    )
