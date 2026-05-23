from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class PortfolioAnalyzerRequest(BaseModel):
    github_username: str
    language: str = "english"


class GitHubProfile(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: str = ""
    html_url: str = ""
    followers: int = 0
    following: int = 0


class GitHubRepository(BaseModel):
    name: str
    description: str = ""
    html_url: str
    language: Optional[str] = None
    topics: List[str] = []
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    default_branch: str = "main"
    updated_at: Optional[str] = None
    readme: str = ""


class RepoReview(BaseModel):
    name: str
    description: str = ""
    html_url: str
    language: Optional[str] = None
    topics: List[str] = []
    stars: int = 0
    forks: int = 0
    score: int = Field(ge=0, le=100)
    tag: str
    recruiter_attention: Literal["high", "medium", "low"]
    attention_reason: str = ""
    summary: str
    strengths: List[str]
    risks: List[str]
    improvements: List[str]


class PortfolioSignals(BaseModel):
    technical_depth: int = Field(ge=0, le=100)
    architecture: int = Field(ge=0, le=100)
    readme_quality: int = Field(ge=0, le=100)
    business_impact: int = Field(ge=0, le=100)


class PortfolioAnalyzerResponse(BaseModel):
    github_username: str
    github_profile: GitHubProfile
    portfolio_score: int = Field(ge=0, le=100)
    signals: PortfolioSignals
    top_wins: List[str]
    red_flags: List[str]
    repos: List[RepoReview]
    ai_conclusion: str
