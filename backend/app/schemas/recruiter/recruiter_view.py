from pydantic import BaseModel
from typing import List


class RecruiterSignal(BaseModel):
    readability: int
    impact_density: int
    technical_depth: int
    visual_hierarchy: int


class RecruiterFeedbackCard(BaseModel):
    title: str
    description: str
    confidence: str
    type: str


class RecruiterViewRequest(BaseModel):
    language: str
    resume_content: str
    target_role: str | None = None


class RecruiterViewResponse(BaseModel):
    recruiter_score: int

    signals: RecruiterSignal

    strengths: List[str]

    weak_spots: List[str]

    missing_impact: List[str]

    ai_feedback: List[RecruiterFeedbackCard]
