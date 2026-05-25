from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    JSON,
)

from backend.app.core.database import Base


class InterviewResult(Base):
    __tablename__ = "interview_results"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    mode = Column(String, nullable=False)
    role = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    language = Column(String, nullable=False, default="en")

    overall_score = Column(Integer, nullable=False, default=0)
    confidence_score = Column(Integer, nullable=False, default=0)
    communication_score = Column(Integer, nullable=False, default=0)
    structure_score = Column(Integer, nullable=False, default=0)
    specificity_score = Column(Integer, nullable=False, default=0)

    recruiter_engagement = Column(String, nullable=True)
    filler_words = Column(String, nullable=True)
    estimated_confidence = Column(String, nullable=True)

    strengths = Column(JSON, nullable=False, default=list)
    weaknesses = Column(JSON, nullable=False, default=list)
    recruiter_insights = Column(JSON, nullable=False, default=list)
    coaching_tips = Column(JSON, nullable=False, default=list)

    raw_evaluation = Column(JSON, nullable=False, default=dict)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
