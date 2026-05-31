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

class RecruiterAttentionZone(BaseModel):
    section: str
    label: str
    x: int
    y: int
    width: int
    height: int
    attention: int
    start_second: float
    end_second: float
    reason: str
    priority: str


class RecruiterScanPathPoint(BaseModel):
    section: str
    x: int
    y: int
    second: float
    label: str


class RecruiterDropOffPoint(BaseModel):
    second: float
    section: str
    reason: str
    severity: str


class RecruiterTimelineEvent(BaseModel):
    second: float
    title: str
    description: str
    sentiment: str


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
    attention_zones: List[RecruiterAttentionZone] = []
    scan_path: List[RecruiterScanPathPoint] = []
    drop_off_points: List[RecruiterDropOffPoint] = []
    recruiter_timeline: List[RecruiterTimelineEvent] = []

class SavedRecruiterViewResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    recruiter_score: Optional[int] = None
    analysis: Optional[RecruiterViewResponse] = None
    analyzed_at: datetime

    class Config:
        from_attributes = True
