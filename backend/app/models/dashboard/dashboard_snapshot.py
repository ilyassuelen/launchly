from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
)

from backend.app.core.database import Base


class DashboardSnapshot(Base):
    __tablename__ = "dashboard_snapshots"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    language = Column(
        String,
        nullable=False,
        server_default="english",
        index=True,
    )

    career_score = Column(Integer, nullable=False, default=0)
    recruiter_impression_score = Column(Integer, nullable=False, default=0)
    resume_health_score = Column(Integer, nullable=False, default=0)
    linkedin_score = Column(Integer, nullable=False, default=0)
    portfolio_score = Column(Integer, nullable=False, default=0)
    applications_score = Column(Integer, nullable=False, default=0)
    interview_readiness_score = Column(Integer, nullable=False, default=0)

    summary = Column(JSON, nullable=False, default=dict)
    profile_strength = Column(JSON, nullable=False, default=dict)
    career_growth = Column(JSON, nullable=False, default=list)
    application_pipeline = Column(JSON, nullable=False, default=list)
    insights = Column(JSON, nullable=False, default=list)
    missing_skills = Column(JSON, nullable=False, default=list)
    activity = Column(JSON, nullable=False, default=dict)

    market_fit = Column(JSON, nullable=False, default=dict)
    next_best_actions = Column(JSON, nullable=False, default=list)
    system_health = Column(JSON, nullable=False, default=dict)
    weekly_plan = Column(JSON, nullable=False, default=list)
    skill_gaps = Column(JSON, nullable=False, default=list)
    review_payload = Column(JSON, nullable=False, default=dict)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
