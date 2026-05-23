import base64
from typing import List

import httpx
from fastapi import HTTPException

from backend.app.core.config import settings
from backend.app.schemas.portfolio.portfolio_analyzer import (
    GitHubProfile,
    GitHubRepository,
)


GITHUB_API_BASE = "https://api.github.com"


def _get_github_headers() -> dict:
    token = getattr(settings, "GITHUB_TOKEN", None)

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Launchly-Portfolio-Analyzer",
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    return headers


async def fetch_github_profile(
    username: str,
) -> GitHubProfile:
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="GitHub username is required",
        )

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            f"{GITHUB_API_BASE}/users/{username}",
            headers=_get_github_headers(),
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="GitHub user not found",
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub profile",
            )

        data = response.json()

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
    url = f"{GITHUB_API_BASE}/repos/{username}/{repo_name}/readme"

    response = await client.get(
        url,
        headers=_get_github_headers(),
    )

    if response.status_code == 404:
        return ""

    if response.status_code >= 400:
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
        return ""


async def fetch_github_repositories(
    username: str,
) -> List[GitHubRepository]:
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="GitHub username is required",
        )

    async with httpx.AsyncClient(timeout=20) as client:
        repos_response = await client.get(
            f"{GITHUB_API_BASE}/users/{username}/repos",
            headers=_get_github_headers(),
            params={
                "sort": "updated",
                "direction": "desc",
                "per_page": 20,
            },
        )

        if repos_response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="GitHub user not found",
            )

        if repos_response.status_code >= 400:
            raise HTTPException(
                status_code=502,
                detail="Failed to fetch GitHub repositories",
            )

        repos_data = repos_response.json()

        repositories: List[GitHubRepository] = []

        for repo in repos_data:
            if repo.get("fork"):
                continue

            repo_name = repo.get("name", "")

            readme = await _fetch_readme(
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
                    readme=readme,
                )
            )

        return repositories
