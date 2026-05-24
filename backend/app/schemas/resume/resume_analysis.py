from typing import List
from pydantic import BaseModel


class SmartSuggestion(BaseModel):
    title: str
    description: str
    type: str
    priority: str


class RecruiterAnalysis(BaseModel):
    strongest_area: str
    improvement_opportunity: str
    recruiter_impression: str


class ATSBreakdown(BaseModel):
    completeness: int
    keyword_relevance: int
    experience_quality: int
    formatting: int
    readability: int


class ATSScore(BaseModel):
    score: int
    breakdown: ATSBreakdown


class ResumeAnalysisRequest(BaseModel):
    tone: str
    language: str
    resume_content: str
    target_role: str | None = None
    resume_id: int | None = None


class ResumeAnalysisResponse(BaseModel):
    smart_suggestions: List[SmartSuggestion]
    recruiter_analysis: RecruiterAnalysis
    ats_score: ATSScore
