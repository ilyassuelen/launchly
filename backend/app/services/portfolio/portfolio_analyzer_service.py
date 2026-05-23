import json
from typing import Any, Dict, List

from fastapi import HTTPException
from openai import AsyncOpenAI

from backend.app.core.config import settings

from backend.app.prompts.portfolio.portfolio_analyzer_prompts import (
    PORTFOLIO_ANALYZER_SYSTEM_PROMPT,
    build_portfolio_analyzer_prompt,
)

from backend.app.schemas.portfolio.portfolio_analyzer import (
    PortfolioAnalyzerRequest,
    PortfolioAnalyzerResponse,
    PortfolioSignals,
    RepoReview,
)

from backend.app.services.portfolio.github_service import (
    fetch_github_profile,
    fetch_github_repositories,
)


client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


def _clamp(value: int) -> int:
    return max(0, min(100, value))


def _score_repo_locally(repo) -> int:
    score = 35

    if repo.description:
        score += 10

    if repo.readme and len(repo.readme.split()) > 80:
        score += 18

    if repo.language:
        score += 8

    if repo.topics:
        score += min(10, len(repo.topics) * 2)

    if repo.stars > 0:
        score += min(10, repo.stars)

    combined_text = f"{repo.name} {repo.description} {repo.readme}".lower()

    if any(
        keyword in combined_text
        for keyword in [
            "api",
            "auth",
            "database",
            "backend",
            "ai",
            "rag",
            "dashboard",
            "analytics",
            "fullstack",
            "fastapi",
            "next",
            "react",
            "postgres",
            "docker",
            "tests",
            "deployment",
            "architecture",
        ]
    ):
        score += 12

    if any(
        keyword in repo.name.lower()
        for keyword in [
            "todo",
            "tutorial",
            "clone",
        ]
    ):
        score -= 22

    return _clamp(score)


def _tag_from_score(score: int) -> str:
    if score >= 85:
        return "Strong"

    if score >= 70:
        return "Good"

    if score >= 50:
        return "Decent"

    return "Needs work"


def _attention_from_score(score: int) -> str:
    if score >= 80:
        return "high"

    if score >= 60:
        return "medium"

    return "low"


def _normalize_attention(value: str, score: int) -> str:
    value = (value or "").lower().strip()

    if value in ["high", "medium", "low"]:
        return value

    return _attention_from_score(score)


async def analyze_portfolio(
    payload: PortfolioAnalyzerRequest,
) -> PortfolioAnalyzerResponse:
    github_profile = await fetch_github_profile(
        payload.github_username,
    )

    repositories = await fetch_github_repositories(
        payload.github_username,
    )

    if not repositories:
        raise HTTPException(
            status_code=404,
            detail="No public repositories found for this GitHub user",
        )

    compact_repos: List[Dict[str, Any]] = []

    for repo in repositories:
        local_score = _score_repo_locally(repo)

        compact_repos.append(
            {
                "name": repo.name,
                "description": repo.description,
                "html_url": repo.html_url,
                "language": repo.language,
                "topics": repo.topics,
                "stars": repo.stars,
                "forks": repo.forks,
                "open_issues": repo.open_issues,
                "updated_at": repo.updated_at,
                "local_score": local_score,
                "readme_excerpt": repo.readme[:2500],
            }
        )

    prompt = build_portfolio_analyzer_prompt(
        language=payload.language,
        repos=compact_repos,
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
                "content": PORTFOLIO_ANALYZER_SYSTEM_PROMPT,
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
            detail="Invalid portfolio analyzer response",
        )

    repo_lookup = {
        repo.name: repo for repo in repositories
    }

    repo_reviews: List[RepoReview] = []

    for item in parsed.get("repos", []):
        repo_name = item.get("name", "")
        source_repo = repo_lookup.get(repo_name)

        if not source_repo:
            continue

        score = _clamp(
            int(
                item.get(
                    "score",
                    _score_repo_locally(source_repo),
                )
            )
        )

        recruiter_attention = _normalize_attention(
            item.get("recruiter_attention", ""),
            score,
        )

        repo_reviews.append(
            RepoReview(
                name=source_repo.name,
                description=source_repo.description,
                html_url=source_repo.html_url,
                language=source_repo.language,
                topics=source_repo.topics,
                stars=source_repo.stars,
                forks=source_repo.forks,
                score=score,
                tag=item.get("tag") or _tag_from_score(score),
                recruiter_attention=recruiter_attention,
                attention_reason=item.get(
                    "attention_reason",
                    "",
                ),
                summary=item.get("summary", ""),
                strengths=item.get("strengths", [])[:4],
                risks=item.get("risks", [])[:3],
                improvements=item.get("improvements", [])[:4],
            )
        )

    if not repo_reviews:
        for repo in repositories:
            score = _score_repo_locally(repo)

            recruiter_attention = _attention_from_score(score)

            repo_reviews.append(
                RepoReview(
                    name=repo.name,
                    description=repo.description,
                    html_url=repo.html_url,
                    language=repo.language,
                    topics=repo.topics,
                    stars=repo.stars,
                    forks=repo.forks,
                    score=score,
                    tag=_tag_from_score(score),
                    recruiter_attention=recruiter_attention,
                    attention_reason="Estimated from repository completeness, README quality and recruiter signal.",
                    summary="Repository analyzed with local scoring fallback.",
                    strengths=[],
                    risks=[],
                    improvements=[],
                )
            )

    fallback_score = int(
        sum(repo.score for repo in repo_reviews)
        / len(repo_reviews)
    )

    portfolio_score = _clamp(
        int(
            parsed.get(
                "portfolio_score",
                fallback_score,
            )
        )
    )

    signals_data = parsed.get("signals", {})

    return PortfolioAnalyzerResponse(
        github_username=payload.github_username,
        github_profile=github_profile,
        portfolio_score=portfolio_score,
        signals=PortfolioSignals(
            technical_depth=_clamp(
                int(
                    signals_data.get(
                        "technical_depth",
                        portfolio_score,
                    )
                )
            ),
            architecture=_clamp(
                int(
                    signals_data.get(
                        "architecture",
                        portfolio_score,
                    )
                )
            ),
            readme_quality=_clamp(
                int(
                    signals_data.get(
                        "readme_quality",
                        portfolio_score,
                    )
                )
            ),
            business_impact=_clamp(
                int(
                    signals_data.get(
                        "business_impact",
                        portfolio_score,
                    )
                )
            ),
        ),
        top_wins=parsed.get("top_wins", [])[:5],
        red_flags=parsed.get("red_flags", [])[:5],
        repos=repo_reviews,
        ai_conclusion=parsed.get("ai_conclusion", ""),
    )
