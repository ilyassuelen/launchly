from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DashboardMetric(BaseModel):
    value: int
    label: str | None = None
    delta: str | None = None


class CareerGrowthPoint(BaseModel):
    d: str
    v: int


class DashboardInsight(BaseModel):
    title: str
    description: str
    action_label: str
    target_path: str
    type: str = "suggestion"


class DashboardApplicationItem(BaseModel):
    company_name: str
    job_title: str
    status: str
    date_label: str | None = None


class DashboardMissingSkill(BaseModel):
    skill: str
    priority: str = "medium"


class DashboardActivity(BaseModel):
    streak_days: int = 0
    heatmap: List[int] = Field(default_factory=list)


class DashboardActionItem(BaseModel):
    title: str
    description: str
    action_label: str
    target_path: str
    priority: str = "medium"
    type: str = "general"


class DashboardSystemHealth(BaseModel):
    resume: int = 0
    recruiter_view: int = 0
    linkedin: int = 0
    portfolio: int = 0
    applications: int = 0
    interview: int = 0


class DashboardWeeklyPlanItem(BaseModel):
    day: str
    title: str
    description: str
    target_path: str | None = None


class DashboardSummaryResponse(BaseModel):
    id: Optional[int] = None

    language: str = "english"

    career_score: DashboardMetric
    recruiter_impression: DashboardMetric
    resume_health: DashboardMetric
    interview_readiness: DashboardMetric

    market_fit: Dict[str, Any]
    profile_strength: Dict[str, int]
    career_growth: List[CareerGrowthPoint]
    application_pipeline: List[DashboardApplicationItem]
    insights: List[DashboardInsight]
    missing_skills: List[DashboardMissingSkill]
    activity: DashboardActivity

    next_best_actions: List[DashboardActionItem] = Field(default_factory=list)
    system_health: DashboardSystemHealth = Field(default_factory=DashboardSystemHealth)
    weekly_plan: List[DashboardWeeklyPlanItem] = Field(default_factory=list)
    review_payload: Dict[str, Any] = Field(default_factory=dict)

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
