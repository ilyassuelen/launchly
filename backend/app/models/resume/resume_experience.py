from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
)

from backend.app.core.database import Base


class ResumeExperience(Base):
    __tablename__ = "resume_experiences"

    id = Column(Integer, primary_key=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    role = Column(String)
    company = Column(String)
    location = Column(String)

    start_date = Column(String)
    end_date = Column(String)

    bullets = Column(Text)

    order_index = Column(Integer)
