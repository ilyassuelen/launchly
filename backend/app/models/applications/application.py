from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.core.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)

    status = Column(String, default="applied", nullable=False)

    applied_date = Column(Date, nullable=False)
    phone_screen_date = Column(Date, nullable=True)
    onsite_date = Column(Date, nullable=True)
    offer_date = Column(Date, nullable=True)
    rejected_date = Column(Date, nullable=True)

    follow_up_date = Column(Date, nullable=True)

    notes = Column(Text, default="", nullable=False)

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
