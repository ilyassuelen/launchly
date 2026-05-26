from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.core.database import Base


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    target_role = Column(String, nullable=False)
    current_level = Column(String, nullable=True)
    timeframe_months = Column(Integer, nullable=True)

    input_snapshot = Column(JSON, nullable=True)

    roadmap = Column(JSON, nullable=False, default=list)
    skill_gaps = Column(JSON, nullable=False, default=list)
    learning_plan = Column(JSON, nullable=False, default=list)
    project_plan = Column(JSON, nullable=False, default=list)
    application_strategy = Column(JSON, nullable=False, default=list)

    summary = Column(String, nullable=True)

    confidence_score = Column(Integer, nullable=True)

    role_fit = Column(String, nullable=True)
    role_fit_summary = Column(String, nullable=True)

    status = Column(String, nullable=False, default="completed")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship("User")
