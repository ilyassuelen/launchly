import json
import re

from fastapi import HTTPException
from openai import AsyncOpenAI

from backend.app.core.config import settings

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


ACTION_VERBS = [
    "built",
    "created",
    "improved",
    "managed",
    "led",
    "designed",
    "implemented",
    "optimized",
    "reduced",
    "increased",
    "generated",
    "launched",
]


def calculate_recruiter_signals(
    resume_content: str,
):
    text = (resume_content or "").lower()

    readability = 70
    impact_density = 50
    technical_depth = 50
    visual_hierarchy = 70

    # readability
    avg_sentence_length = (
        len(text.split()) /
        max(1, len(text.split(".")))
    )

    if avg_sentence_length < 25:
        readability += 15

    if "\n" in text:
        readability += 6

    # impact density
    number_matches = len(
        re.findall(r"\d+", text)
    )

    impact_density += min(
        35,
        number_matches * 4,
    )

    # technical depth
    keyword_count = len(
        re.findall(
            r"\b(api|python|excel|sales|marketing|figma|analytics|management|react|finance)\b",
            text,
        )
    )

    technical_depth += min(
        35,
        keyword_count * 4,
    )

    # visual hierarchy
    if "-" in text or "•" in text:
        visual_hierarchy += 10

    if len(text.splitlines()) > 10:
        visual_hierarchy += 10

    return RecruiterSignal(
        readability=max(
            0,
            min(100, readability),
        ),

        impact_density=max(
            0,
            min(100, impact_density),
        ),

        technical_depth=max(
            0,
            min(100, technical_depth),
        ),

        visual_hierarchy=max(
            0,
            min(100, visual_hierarchy),
        ),
    )


async def analyze_recruiter_view(
    payload: RecruiterViewRequest,
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
                "content":
                    RECRUITER_VIEW_SYSTEM_PROMPT,
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

    return RecruiterViewResponse(
        recruiter_score=recruiter_score,

        signals=signals,

        strengths=parsed.get(
            "strengths",
            [],
        )[:4],

        weak_spots=parsed.get(
            "weak_spots",
            [],
        )[:4],

        missing_impact=parsed.get(
            "missing_impact",
            [],
        )[:4],

        ai_feedback=[
            RecruiterFeedbackCard(**item)
            for item in parsed.get(
                "ai_feedback",
                [],
            )[:3]
        ],
    )
