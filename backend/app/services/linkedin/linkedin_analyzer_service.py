import json
import logging
import re

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.prompts.linkedin.linkedin_analyzer_prompts import (
    LINKEDIN_ANALYZER_SYSTEM_PROMPT,
    build_linkedin_analyzer_prompt,
)

from backend.app.schemas.linkedin.linkedin_analyzer import (
    LinkedInAnalyzerRequest,
    LinkedInAnalyzerResponse,
    LinkedInSignals,
    MissingKeyword,
    SearchVisibilityItem,
    RecruiterMatchBreakdown,
)

from backend.app.services.linkedin.linkedin_profile_service import (
    save_linkedin_analysis,
)
from backend.app.services.privacy.llm_privacy import prepare_data

logger = logging.getLogger(__name__)

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


RELEVANT_KEYWORDS = [
    "communication",
    "leadership",
    "teamwork",
    "problem solving",
    "organization",
    "project management",
    "customer service",
    "sales",
    "marketing",
    "operations",
    "administration",
    "analysis",
    "strategy",
    "coordination",
    "planning",
    "reporting",
    "training",
    "consulting",
    "support",
    "research",
    "stakeholder management",
    "process improvement",
    "quality assurance",
    "data analysis",
    "crm",
    "microsoft office",
    "excel",
    "presentations",
    "documentation",
    "software",
    "ai",
    "automation",
    "databases",
    "apis",
    "python",
    "sql",
    "cloud",
    "digital transformation",
    "patient care",
    "education",
    "coaching",
    "case management",
    "social work",
    "accounting",
    "finance",
    "compliance",
    "legal",
    "recruiting",
    "human resources",
]


ACTION_WORDS = [
    "built",
    "created",
    "developed",
    "implemented",
    "designed",
    "improved",
    "optimized",
    "launched",
    "managed",
    "coordinated",
    "organized",
    "supported",
    "led",
    "trained",
    "analyzed",
    "planned",
    "delivered",
    "resolved",
    "increased",
    "reduced",
]


def _clamp(value: int) -> int:
    return max(0, min(100, value))


def _serialize_linkedin_analysis(
    response: LinkedInAnalyzerResponse,
) -> dict:
    return response.model_dump()


def calculate_linkedin_signals(
    payload: LinkedInAnalyzerRequest,
) -> LinkedInSignals:
    headline = payload.headline or ""
    about = payload.about or ""
    skills = payload.skills or []
    projects = payload.projects or []
    target_role = payload.target_role or ""

    full_text = (
        f"{headline} {about} {' '.join(skills)} "
        f"{' '.join(projects)} {target_role}"
    ).lower()

    headline_score = 45
    about_score = 45
    skills_score = 40
    search_visibility = 40

    if len(headline.split()) >= 5:
        headline_score += 15

    if target_role.lower() in headline.lower():
        headline_score += 20

    if any(
        keyword in headline.lower()
        for keyword in RELEVANT_KEYWORDS
    ):
        headline_score += 15

    if len(about.split()) >= 45:
        about_score += 20

    if re.search(r"\d+", about):
        about_score += 15

    if any(
        word in about.lower()
        for word in ACTION_WORDS
    ):
        about_score += 15

    if projects:
        about_score += 8
        search_visibility += 8

    if any(
        re.search(r"\d+", project)
        for project in projects
    ):
        about_score += 7
        search_visibility += 7

    skills_score += min(
        40,
        len(skills) * 5,
    )

    matched_keywords = sum(
        1
        for keyword in RELEVANT_KEYWORDS
        if keyword in full_text
    )

    search_visibility += min(
        45,
        matched_keywords * 5,
    )

    return LinkedInSignals(
        headline=_clamp(headline_score),
        about=_clamp(about_score),
        skills=_clamp(skills_score),
        search_visibility=_clamp(search_visibility),
    )


async def analyze_linkedin_profile(
    payload: LinkedInAnalyzerRequest,
    db: Session | None = None,
    user_id: int | None = None,
) -> LinkedInAnalyzerResponse:
    signals = calculate_linkedin_signals(
        payload,
    )

    profile_score = int(
        (
            signals.headline +
            signals.about +
            signals.skills +
            signals.search_visibility
        ) / 4
    )

    clean_headline = prepare_data(payload.headline)
    clean_about = prepare_data(payload.about)
    clean_skills = prepare_data(payload.skills)
    clean_projects = prepare_data(payload.projects)
    clean_target_role = prepare_data(payload.target_role)

    prompt = build_linkedin_analyzer_prompt(
        language=payload.language,
        headline=clean_headline,
        about=clean_about,
        skills=clean_skills,
        projects=clean_projects,
        target_role=clean_target_role,
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.4,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content": LINKEDIN_ANALYZER_SYSTEM_PROMPT,
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
            "LinkedIn analyzer request failed",
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze LinkedIn profile",
        ) from exc

    try:
        parsed = json.loads(content)

    except Exception as exc:
        logger.exception(
            "Failed to parse LinkedIn analyzer response",
        )

        logger.error(
            "Invalid LinkedIn analyzer response content: %s",
            content,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid LinkedIn analyzer response",
        ) from exc

    if not isinstance(parsed, dict):
        logger.error(
            "LinkedIn analyzer response is not a dictionary: %s",
            parsed,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid LinkedIn analyzer response structure",
        )

    match_breakdown_data = parsed.get(
        "match_breakdown",
        {},
    )

    required_fields = [
        "headline_rewrite",
        "about_rewrite",
        "ai_conclusion",
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in parsed
    ]

    if missing_fields:
        logger.error(
            "Missing LinkedIn analyzer response fields: %s | Response: %s",
            missing_fields,
            parsed,
        )

    analysis = LinkedInAnalyzerResponse(
        profile_score=profile_score,

        signals=signals,

        missing_keywords=[
            MissingKeyword(**item)
            for item in parsed.get(
                "missing_keywords",
                [],
            )[:6]
        ],

        headline_rewrite=parsed.get(
            "headline_rewrite",
            "",
        ),

        about_rewrite=parsed.get(
            "about_rewrite",
            "",
        ),

        recruiter_search_visibility=[
            SearchVisibilityItem(**item)
            for item in parsed.get(
                "recruiter_search_visibility",
                [],
            )[:3]
        ],

        match_breakdown=RecruiterMatchBreakdown(
            target_role_match=_clamp(
                int(
                    (
                        signals.headline +
                        signals.search_visibility
                    ) / 2
                )
            ),
            keyword_coverage=signals.skills,
            search_visibility=signals.search_visibility,
            profile_clarity=_clamp(
                int(
                    (
                        signals.headline +
                        signals.about
                    ) / 2
                )
            ),
            missing_proof_points=match_breakdown_data.get(
                "missing_proof_points",
                [],
            )[:5],
        ),

        ai_conclusion=parsed.get(
            "ai_conclusion",
            "",
        ),
    )

    if db and user_id:
        save_linkedin_analysis(
            db=db,
            user_id=user_id,
            language=payload.language,
            headline=payload.headline,
            about=payload.about,
            skills=payload.skills,
            projects=payload.projects,
            target_role=payload.target_role,
            analysis=_serialize_linkedin_analysis(analysis),
            profile_score=analysis.profile_score,
        )

    return analysis
