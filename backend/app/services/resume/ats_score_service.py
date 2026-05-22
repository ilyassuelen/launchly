import re

from backend.app.schemas.resume.resume_analysis import (
    ATSScore,
    ATSBreakdown,
)


ACTION_VERBS = [
    "built",
    "developed",
    "created",
    "improved",
    "optimized",
    "managed",
    "led",
    "designed",
    "implemented",
    "increased",
    "reduced",
    "launched",
    "organized",
    "coordinated",
    "analyzed",
    "generated",
    "achieved",
    "delivered",
]


GENERIC_KEYWORDS = {
    "marketing": [
        "campaign",
        "seo",
        "branding",
        "social media",
        "analytics",
    ],

    "sales": [
        "sales",
        "crm",
        "client",
        "revenue",
        "negotiation",
    ],

    "design": [
        "figma",
        "ui",
        "ux",
        "prototype",
        "branding",
    ],

    "finance": [
        "excel",
        "budget",
        "forecast",
        "analysis",
        "reporting",
    ],

    "software": [
        "python",
        "react",
        "api",
        "backend",
        "frontend",
    ],
}


def detect_role_keywords(
    target_role: str,
) -> list[str]:

    target_role_lower = (
        target_role or ""
    ).lower()

    matched_keywords = []

    for category, keywords in (
        GENERIC_KEYWORDS.items()
    ):
        if category in target_role_lower:
            matched_keywords.extend(keywords)

    return matched_keywords


def calculate_ats_score(
    *,
    resume_content: str,
    target_role: str,
) -> ATSScore:

    text = (
        resume_content or ""
    ).lower()

    total_score = 0

    breakdown = {
        "completeness": 0,
        "keyword_relevance": 0,
        "experience_quality": 0,
        "formatting": 0,
        "readability": 0,
    }

    # -----------------------------
    # COMPLETENESS (20)
    # -----------------------------

    completeness_score = 0

    required_sections = [
        "summary",
        "experience",
        "skills",
        "projects",
    ]

    for section in required_sections:
        if section in text:
            completeness_score += 5

    breakdown["completeness"] = (
        completeness_score
    )

    total_score += completeness_score

    # -----------------------------
    # KEYWORD RELEVANCE (25)
    # -----------------------------

    keyword_score = 0

    keywords = detect_role_keywords(
        target_role
    )

    if keywords:
        matched = sum(
            1
            for keyword in keywords
            if keyword in text
        )

        keyword_score = min(
            25,
            matched * 5,
        )
    else:
        keyword_score = 15

    breakdown["keyword_relevance"] = (
        keyword_score
    )

    total_score += keyword_score

    # -----------------------------
    # EXPERIENCE QUALITY (25)
    # -----------------------------

    experience_score = 0

    action_verb_matches = sum(
        1
        for verb in ACTION_VERBS
        if verb in text
    )

    experience_score += min(
        15,
        action_verb_matches * 2,
    )

    number_matches = len(
        re.findall(r"\d+", text)
    )

    experience_score += min(
        10,
        number_matches,
    )

    breakdown["experience_quality"] = (
        experience_score
    )

    total_score += experience_score

    # -----------------------------
    # FORMATTING (15)
    # -----------------------------

    formatting_score = 0

    if len(text.splitlines()) > 10:
        formatting_score += 5

    if "-" in text or "•" in text:
        formatting_score += 5

    if len(text) > 1000:
        formatting_score += 5

    breakdown["formatting"] = (
        formatting_score
    )

    total_score += formatting_score

    # -----------------------------
    # READABILITY (15)
    # -----------------------------

    readability_score = 0

    avg_sentence_length = (
        len(text.split()) /
        max(1, len(text.split(".")))
    )

    if avg_sentence_length < 30:
        readability_score += 8

    if avg_sentence_length > 8:
        readability_score += 7

    breakdown["readability"] = (
        readability_score
    )

    total_score += readability_score

    total_score = max(
        0,
        min(100, total_score),
    )

    return ATSScore(
        score=total_score,

        breakdown=ATSBreakdown(
            completeness=breakdown[
                "completeness"
            ],
            keyword_relevance=breakdown[
                "keyword_relevance"
            ],
            experience_quality=breakdown[
                "experience_quality"
            ],
            formatting=breakdown[
                "formatting"
            ],
            readability=breakdown[
                "readability"
            ],
        ),
    )
