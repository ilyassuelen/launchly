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


class DashboardReview(Base):
    __tablename__ = "dashboard_reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    status = Column(
        String,
        default="completed",
        nullable=False,
    )

    input_data = Column(JSON, nullable=False, default=dict)
    result = Column(JSON, nullable=False, default=dict)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
