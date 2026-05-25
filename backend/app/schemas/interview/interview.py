from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class InterviewStartRequest(BaseModel):
    mode: str = Field(..., min_length=2)
    role: str = Field(..., min_length=2)
    difficulty: str = Field(..., min_length=2)
    language: str = "en"
    max_questions: int = Field(default=5, ge=3, le=10)


class InterviewAnswerRequest(BaseModel):
    answer: str = Field(..., min_length=1)


class InterviewMessageResponse(BaseModel):
    id: Optional[int] = None
    session_id: int
    role: str
    content: str
    question_index: Optional[int] = None
    message_type: str = "message"
    meta: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewSessionResponse(BaseModel):
    id: int
    user_id: int

    mode: str
    role: str
    difficulty: str
    language: str

    status: str
    current_question_index: int
    max_questions: int

    resume_context: Dict[str, Any] = Field(default_factory=dict)
    session_context: Dict[str, Any] = Field(default_factory=dict)

    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewInsight(BaseModel):
    title: str
    description: str
    impact: str = "medium"


class InterviewResultResponse(BaseModel):
    id: Optional[int] = None
    session_id: int
    user_id: int

    mode: str
    role: str
    difficulty: str
    language: str

    overall_score: int = 0
    confidence_score: int = 0
    communication_score: int = 0
    structure_score: int = 0
    specificity_score: int = 0

    recruiter_engagement: Optional[str] = None
    filler_words: Optional[str] = None
    estimated_confidence: Optional[str] = None

    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recruiter_insights: List[InterviewInsight] = Field(default_factory=list)
    coaching_tips: List[str] = Field(default_factory=list)

    raw_evaluation: Dict[str, Any] = Field(default_factory=dict)

    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewStartResponse(BaseModel):
    session: InterviewSessionResponse
    first_message: InterviewMessageResponse


class InterviewAnswerResponse(BaseModel):
    session: InterviewSessionResponse
    user_message: InterviewMessageResponse
    ai_message: Optional[InterviewMessageResponse] = None
    result: Optional[InterviewResultResponse] = None


class InterviewSessionDetailResponse(BaseModel):
    session: InterviewSessionResponse
    messages: List[InterviewMessageResponse] = Field(default_factory=list)
    result: Optional[InterviewResultResponse] = None


class InterviewStatsBucket(BaseModel):
    difficulty: str
    sessions: int = 0
    average_score: int = 0
    best_score: int = 0


class InterviewStatsResponse(BaseModel):
    total_sessions: int = 0
    average_score: int = 0
    best_score: int = 0
    by_difficulty: List[InterviewStatsBucket] = Field(default_factory=list)
    recent_results: List[InterviewResultResponse] = Field(default_factory=list)
