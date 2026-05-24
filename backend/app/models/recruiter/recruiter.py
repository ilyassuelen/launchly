from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    UniqueConstraint,
)

from backend.app.core.database import Base


class RecruiterViewAnalysis(Base):
    __tablename__ = "recruiter_view_analyses"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "resume_id",
            name="uq_recruiter_view_user_resume",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    recruiter_score = Column(Integer, nullable=True)

    analysis = Column(JSON, nullable=True)

    analyzed_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
