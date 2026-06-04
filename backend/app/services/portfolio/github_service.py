import base64
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple

import httpx
from fastapi import HTTPException

from backend.app.core.config import settings

from backend.app.schemas.portfolio.portfolio_analyzer import (
    GitHubActivity,
    GitHubProfile,
    GitHubRepository,
)


logger = logging.getLogger(__name__)

GITHUB_API_BASE = "https://api.github.com"


def _get_github_headers() -> dict:
    """
    Build GitHub API request headers and
    optionally include the configured API token.
    """
    token = getattr(settings, "GITHUB_TOKEN", None)

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Launchly-Portfolio-Analyzer",
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    return headers


def _parse_github_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _get_activity_level(score: int) -> str:
    if score >= 75:
        return "high"
    if score >= 45:
        return "medium"
    return "low"


def _calculate_consistency_score(
    recent_commits_30d: int,
    recent_commits_90d: int,
    active_repositories_90d: int,
) -> int:
    """
    Calculate a conservative GitHub activity score.
    This rewards recent commits, sustained activity over 90 days,
    and activity spread across more than one repository.
    """
    commits_30d_score = min(45, recent_commits_30d * 3)
    commits_90d_score = min(35, recent_commits_90d)
    active_repo_score = min(20, active_repositories_90d * 7)

    return max(
        0,
        min(
            100,
            commits_30d_score + commits_90d_score + active_repo_score,
        ),
    )


async def _fetch_repo_commit_activity(
    client: httpx.AsyncClient,
    username: str,
    repo_name: str,
) -> Tuple[int, int, Optional[str]]:
    """
    Fetch commit activity for one repository.
    Returns commits in the last 30 days, commits in the last 90 days,
    and the latest commit timestamp.
    """
    now = datetime.now(timezone.utc)
    since_30d = now - timedelta(days=30)
    since_90d = now - timedelta(days=90)

    commit_url = f"{GITHUB_API_BASE}/repos/{username}/{repo_name}/commits"
    commits_30d = 0
    commits_90d = 0
    latest_commit_at: Optional[str] = None

    for page in range(1, 4):
        try:
            response = await client.get(
                commit_url,
                headers=_get_github_headers(),
                params={
                    "since": since_90d.isoformat(),
                    "per_page": 100,
                    "page": page,
                },
            )
        except Exception:
            logger.exception(
                "Failed to fetch GitHub commits username=%s repo=%s page=%s",
                username,
                repo_name,
                page,
            )
            break

        if response.status_code == 409:
            logger.info(
                "GitHub repository has no commits username=%s repo=%s",
                username,
                repo_name,
            )
            break

        if response.status_code == 404:
            break

        if response.status_code >= 400:
            logger.warning(
                "GitHub commits request failed username=%s repo=%s status_code=%s",
                username,
                repo_name,
                response.status_code,
            )
            break

        commits = response.json()

        if not commits:
            break

        for commit in commits:
            commit_date_raw = (
                commit.get("commit", {})
                .get("committer", {})
                .get("date")
            )
            commit_date = _parse_github_datetime(commit_date_raw)

            if not commit_date:
                continue

            commits_90d += 1

            if commit_date >= since_30d:
                commits_30d += 1

            if latest_commit_at is None:
                latest_commit_at = commit_date_raw

        if len(commits) < 100:
            break

    return commits_30d, commits_90d, latest_commit_at


async def fetch_github_profile(
    username: str,
) -> GitHubProfile:
    """
    Fetch public GitHub profile information
    for the provided username.
    """
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="GitHub username is required",
        )

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            response = await client.get(
                f"{GITHUB_API_BASE}/users/{username}",
                headers=_get_github_headers(),
            )
        except Exception:
            logger.exception(
                "Failed to fetch GitHub profile username=%s",
                username,
            )
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub profile",
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="GitHub user not found",
            )

        if response.status_code >= 400:
            logger.warning(
                "GitHub profile request failed username=%s status_code=%s",
                username,
                response.status_code,
            )
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub profile",
            )

        data = response.json()
        logger.info(
            "Fetched GitHub profile username=%s followers=%s following=%s",
            username,
            data.get("followers", 0),
            data.get("following", 0),
        )

        return GitHubProfile(
            username=data.get("login", username),
            name=data.get("name"),
            bio=data.get("bio"),
            avatar_url=data.get("avatar_url", ""),
            html_url=data.get("html_url", ""),
            followers=data.get("followers", 0),
            following=data.get("following", 0),
        )


async def _fetch_readme(
    client: httpx.AsyncClient,
    username: str,
    repo_name: str,
) -> str:
    """
    Fetch and decode the repository README
    content from the GitHub API.
    """
    url = f"{GITHUB_API_BASE}/repos/{username}/{repo_name}/readme"

    try:
        response = await client.get(
            url,
            headers=_get_github_headers(),
        )
    except Exception:
        logger.exception(
            "Failed to fetch GitHub README username=%s repo=%s",
            username,
            repo_name,
        )
        return ""

    if response.status_code == 404:
        return ""

    if response.status_code >= 400:
        logger.warning(
            "GitHub README request failed username=%s repo=%s status_code=%s",
            username,
            repo_name,
            response.status_code,
        )
        return ""

    data = response.json()
    encoded_content = data.get("content", "")

    if not encoded_content:
        return ""

    try:
        decoded = base64.b64decode(
            encoded_content,
        ).decode("utf-8", errors="ignore")

        return decoded[:8000]

    except Exception:
        logger.exception(
            "Failed to decode GitHub README username=%s repo=%s",
            username,
            repo_name,
        )
        return ""


async def fetch_github_activity(
    username: str,
    repositories: List[GitHubRepository],
) -> GitHubActivity:
    """
    Fetch and aggregate public GitHub commit activity
    across the repositories already selected for analysis.
    """
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="GitHub username is required",
        )

    recent_commits_30d = 0
    recent_commits_90d = 0
    active_repositories_90d = 0
    last_activity_at: Optional[str] = None
    repo_activity: Dict[str, Dict[str, Optional[int | str]]] = {}

    async with httpx.AsyncClient(timeout=20) as client:
        for repository in repositories:
            commits_30d, commits_90d, latest_commit_at = await _fetch_repo_commit_activity(
                client=client,
                username=username,
                repo_name=repository.name,
            )

            recent_commits_30d += commits_30d
            recent_commits_90d += commits_90d

            if commits_90d > 0:
                active_repositories_90d += 1

            if latest_commit_at:
                current_latest = _parse_github_datetime(last_activity_at)
                repo_latest = _parse_github_datetime(latest_commit_at)

                if repo_latest and (not current_latest or repo_latest > current_latest):
                    last_activity_at = latest_commit_at

            repo_activity[repository.name] = {
                "commits_30d": commits_30d,
                "commits_90d": commits_90d,
                "last_commit_at": latest_commit_at,
            }

    consistency_score = _calculate_consistency_score(
        recent_commits_30d=recent_commits_30d,
        recent_commits_90d=recent_commits_90d,
        active_repositories_90d=active_repositories_90d,
    )

    activity = GitHubActivity(
        recent_commits_30d=recent_commits_30d,
        recent_commits_90d=recent_commits_90d,
        active_repositories_90d=active_repositories_90d,
        last_activity_at=last_activity_at,
        consistency_score=consistency_score,
        activity_level=_get_activity_level(consistency_score),
    )

    logger.info(
        "Fetched GitHub activity username=%s commits_30d=%s commits_90d=%s active_repos_90d=%s score=%s level=%s repo_activity=%s",
        username,
        recent_commits_30d,
        recent_commits_90d,
        active_repositories_90d,
        consistency_score,
        activity.activity_level,
        repo_activity,
    )

    return activity


async def fetch_github_repositories(
    username: str,
) -> List[GitHubRepository]:
    """
    Fetch and normalize the user's public
    GitHub repositories including README content.
    """
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="GitHub username is required",
        )

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            repos_response = await client.get(
                f"{GITHUB_API_BASE}/users/{username}/repos",
                headers=_get_github_headers(),
                params={
                    "sort": "updated",
                    "direction": "desc",
                    "per_page": 20,
                },
            )
        except Exception:
            logger.exception(
                "Failed to fetch GitHub repositories username=%s",
                username,
            )
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub repositories",
            )

        if repos_response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="GitHub user not found",
            )

        if repos_response.status_code >= 400:
            logger.warning(
                "GitHub repositories request failed username=%s status_code=%s",
                username,
                repos_response.status_code,
            )
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub repositories",
            )

        repos_data = repos_response.json()
        logger.info(
            "Fetched GitHub repositories username=%s repository_count=%s",
            username,
            len(repos_data),
        )

        repositories: List[GitHubRepository] = []

        for repo in repos_data:
            if repo.get("fork"):
                logger.info(
                    "Skipped forked repository username=%s repo=%s",
                    username,
                    repo.get("name", ""),
                )
                continue

            repo_name = repo.get("name", "")

            readme = await _fetch_readme(
                client=client,
                username=username,
                repo_name=repo_name,
            )

            _, commits_90d, last_commit_at = await _fetch_repo_commit_activity(
                client=client,
                username=username,
                repo_name=repo_name,
            )

            repositories.append(
                GitHubRepository(
                    name=repo_name,
                    description=repo.get("description") or "",
                    html_url=repo.get("html_url", ""),
                    language=repo.get("language"),
                    topics=repo.get("topics") or [],
                    stars=repo.get("stargazers_count", 0),
                    forks=repo.get("forks_count", 0),
                    open_issues=repo.get("open_issues_count", 0),
                    default_branch=repo.get("default_branch", "main"),
                    updated_at=repo.get("updated_at"),
                    commits_90d=commits_90d,
                    last_commit_at=last_commit_at,
                    readme=readme,
                )
            )
            logger.info(
                "Processed GitHub repository username=%s repo=%s stars=%s",
                username,
                repo_name,
                repo.get("stargazers_count", 0),
            )

        logger.info(
            "Completed GitHub repository sync username=%s processed_count=%s",
            username,
            len(repositories),
        )
        return repositories
