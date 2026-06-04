import json
import logging
from typing import Any, Dict, List

from fastapi import HTTPException
from openai import AsyncOpenAI

from backend.app.core.config import settings

from backend.app.prompts.portfolio.portfolio_analyzer_prompts import (
    PORTFOLIO_ANALYZER_SYSTEM_PROMPT,
    build_portfolio_analyzer_prompt,
)

from backend.app.schemas.portfolio.portfolio_analyzer import (
    GitHubActivity,
    PortfolioAnalyzerRequest,
    PortfolioAnalyzerResponse,
    PortfolioSignals,
    RepoReview,
)

from backend.app.services.portfolio.github_service import (
    fetch_github_activity,
    fetch_github_profile,
    fetch_github_repositories,
)

logger = logging.getLogger(__name__)


client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)


def _clamp(value: int) -> int:
    return max(0, min(100, value))


def _safe_string_list(
    value,
    limit: int,
) -> list[str]:
    if not isinstance(value, list):
        return []

    return [
        str(item).strip()
        for item in value
        if str(item).strip()
    ][:limit]


def _score_repo_locally(repo) -> int:
    """
    Calculate a local quality score for a repository
    based on structure, README quality and recruiter signals.
    """
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
    """
    Convert a numeric repository score into
    a recruiter-friendly quality label.
    """
    if score >= 85:
        return "Strong"

    if score >= 70:
        return "Good"

    if score >= 50:
        return "Decent"

    return "Needs work"


def _attention_from_score(score: int) -> str:
    """
    Estimate recruiter attention level
    based on the repository score.
    """
    if score >= 80:
        return "high"

    if score >= 60:
        return "medium"

    return "low"


def _normalize_attention(value: str, score: int) -> str:
    """
    Normalize recruiter attention values and
    fall back to a locally estimated level if needed.
    """
    value = (value or "").lower().strip()

    if value in ["high", "medium", "low"]:
        return value

    return _attention_from_score(score)


def _blend_portfolio_score(
    ai_score: int,
    github_activity: GitHubActivity,
) -> int:
    """
    Blend AI portfolio quality with GitHub activity conservatively.
    Repository quality remains the dominant factor, while recent activity
    can add or reduce a small amount of confidence.
    """
    activity_score = github_activity.consistency_score

    blended_score = round((ai_score * 0.86) + (activity_score * 0.14))

    return _clamp(blended_score)


async def analyze_portfolio(
    payload: PortfolioAnalyzerRequest,
) -> PortfolioAnalyzerResponse:
    """
    Analyze GitHub repositories with local scoring and AI feedback
    to evaluate portfolio quality and recruiter relevance.
    """
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

    github_activity = await fetch_github_activity(
        payload.github_username,
        repositories,
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
                "commits_90d": getattr(repo, "commits_90d", 0),
                "last_commit_at": getattr(repo, "last_commit_at", None),
                "local_score": local_score,
                "readme_excerpt": repo.readme[:2500],
            }
        )

    prompt = build_portfolio_analyzer_prompt(
        language=payload.language,
        repos=compact_repos,
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
                    "content": PORTFOLIO_ANALYZER_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        content = (
                response.choices[0].message.content
                or ""
        ).strip()

        if not content:
            logger.error(
                "Portfolio analyzer returned empty response",
            )

            raise HTTPException(
                status_code=500,
                detail="Portfolio analyzer returned an empty response",
            )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception(
            "Portfolio analyzer request failed",
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze portfolio",
        ) from exc

    try:
        parsed = json.loads(content)

    except Exception as exc:
        logger.exception(
            "Failed to parse portfolio analyzer response",
        )

        logger.error(
            "Invalid portfolio analyzer response content: %s",
            content,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid portfolio analyzer response",
        ) from exc

    if not isinstance(parsed, dict):
        logger.error(
            "Portfolio analyzer response is not a dictionary: %s",
            parsed,
        )

        raise HTTPException(
            status_code=500,
            detail="Invalid portfolio analyzer response structure",
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
                commits_90d=getattr(source_repo, "commits_90d", 0),
                last_commit_at=getattr(source_repo, "last_commit_at", None),
                score=score,
                tag=item.get("tag") or _tag_from_score(score),
                recruiter_attention=recruiter_attention,
                attention_reason=item.get(
                    "attention_reason",
                    "",
                ),
                summary=item.get("summary", ""),
                strengths=_safe_string_list(item.get("strengths"), 4),
                risks=_safe_string_list(item.get("risks"), 3),
                improvements=_safe_string_list(item.get("improvements"), 4),
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
                    commits_90d=getattr(repo, "commits_90d", 0),
                    last_commit_at=getattr(repo, "last_commit_at", None),
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

    ai_portfolio_score = _clamp(
        int(
            parsed.get(
                "portfolio_score",
                fallback_score,
            )
        )
    )

    portfolio_score = _blend_portfolio_score(
        ai_score=ai_portfolio_score,
        github_activity=github_activity,
    )

    signals_data = parsed.get("signals", {})

    required_fields = [
        "portfolio_score",
        "ai_conclusion",
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in parsed
    ]

    if missing_fields:
        logger.error(
            "Missing portfolio analyzer response fields: %s | Response: %s",
            missing_fields,
            parsed,
        )

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
            github_activity=github_activity.consistency_score,
        ),
        github_activity=github_activity,
        top_wins=parsed.get("top_wins", [])[:5],
        red_flags=parsed.get("red_flags", [])[:5],
        repos=repo_reviews,
        ai_conclusion=parsed.get("ai_conclusion", ""),
    )
