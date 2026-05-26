from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class CareerPathGenerateRequest(BaseModel):
    language: str = Field(default="english", max_length=20)
    target_role: str = Field(..., min_length=2, max_length=120)
    current_level: Optional[str] = Field(default=None, max_length=80)
    timeframe_months: Optional[int] = Field(default=6, ge=1, le=36)


class CareerPathMilestone(BaseModel):
    title: str
    description: str
    timeframe: str
    priority: str
    tasks: list[str] = Field(default_factory=list)


class CareerPathSkillGap(BaseModel):
    skill: str
    current_level: str
    target_level: str
    reason: str
    priority: str


class CareerPathLearningItem(BaseModel):
    title: str
    description: str
    type: str
    estimated_time: str
    priority: str


class CareerPathProjectItem(BaseModel):
    title: str
    description: str
    skills_practiced: list[str] = Field(default_factory=list)
    portfolio_value: str
    difficulty: str


class CareerPathApplicationStrategyItem(BaseModel):
    title: str
    description: str
    action_items: list[str] = Field(default_factory=list)


class CareerPathResponse(BaseModel):
    id: int
    user_id: int

    target_role: str
    current_level: Optional[str] = None
    timeframe_months: Optional[int] = None

    input_snapshot: Optional[dict[str, Any]] = None

    roadmap: list[dict[str, Any]] = Field(default_factory=list)
    skill_gaps: list[dict[str, Any]] = Field(default_factory=list)
    learning_plan: list[dict[str, Any]] = Field(default_factory=list)
    project_plan: list[dict[str, Any]] = Field(default_factory=list)
    application_strategy: list[dict[str, Any]] = Field(default_factory=list)

    summary: Optional[str] = None
    confidence_score: Optional[int] = None

    role_fit: Optional[str] = None
    role_fit_summary: Optional[str] = None

    status: str

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
