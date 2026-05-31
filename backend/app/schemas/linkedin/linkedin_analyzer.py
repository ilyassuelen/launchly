from pydantic import BaseModel
from typing import List


class LinkedInAnalyzerRequest(BaseModel):
    language: str = "en"
    headline: str
    about: str
    skills: List[str] = []
    projects: List[str] = []
    target_role: str


class LinkedInSignals(BaseModel):
    headline: int
    about: int
    skills: int
    search_visibility: int


class MissingKeyword(BaseModel):
    keyword: str
    reason: str


class SearchVisibilityItem(BaseModel):
    title: str
    rank: str
    description: str


class RecruiterMatchBreakdown(BaseModel):
    target_role_match: int
    keyword_coverage: int
    search_visibility: int
    profile_clarity: int
    missing_proof_points: List[str]


class LinkedInAnalyzerResponse(BaseModel):
    profile_score: int
    signals: LinkedInSignals
    missing_keywords: List[MissingKeyword]
    headline_rewrite: str
    about_rewrite: str
    recruiter_search_visibility: List[SearchVisibilityItem]
    match_breakdown: RecruiterMatchBreakdown
    ai_conclusion: str
