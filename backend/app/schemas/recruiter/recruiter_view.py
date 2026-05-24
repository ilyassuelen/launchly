from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


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
    resume_id: int | None = None


class RecruiterViewResponse(BaseModel):
    recruiter_score: int
    signals: RecruiterSignal
    strengths: List[str]
    weak_spots: List[str]
    missing_impact: List[str]
    ai_feedback: List[RecruiterFeedbackCard]


class SavedRecruiterViewResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    recruiter_score: Optional[int] = None
    analysis: Optional[RecruiterViewResponse] = None
    analyzed_at: datetime

    class Config:
        from_attributes = True
