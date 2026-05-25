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


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

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

    status = Column(String, nullable=False, default="active")

    current_question_index = Column(Integer, nullable=False, default=0)
    max_questions = Column(Integer, nullable=False, default=5)

    resume_context = Column(JSON, nullable=False, default=dict)
    session_context = Column(JSON, nullable=False, default=dict)

    started_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    ended_at = Column(DateTime, nullable=True)

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
