from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    JSON,
)

from backend.app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String,
        default="My Resume",
    )

    template = Column(
        String,
        default="aurora",
    )

    data = Column(
        JSON,
        nullable=True,
    )

    latest_ats_score = Column(
        Integer,
        nullable=True,
    )

    latest_resume_analysis = Column(
        JSON,
        nullable=True,
    )

    analyzed_at = Column(
        DateTime,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
