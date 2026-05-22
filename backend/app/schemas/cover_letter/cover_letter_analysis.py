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


class CoverLetterAnalysisRequest(BaseModel):
    tone: str
    language: str
    job_posting: str
    subject: str
    body: str


class CoverLetterAnalysisResponse(BaseModel):
    smart_suggestions: List[SmartSuggestion]
    recruiter_analysis: RecruiterAnalysis
