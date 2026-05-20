from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)

from backend.app.core.database import Base


class ResumeEducation(Base):
    __tablename__ = "resume_educations"

    id = Column(Integer, primary_key=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    school = Column(String)
    degree = Column(String)

    start_date = Column(String)
    end_date = Column(String)

    order_index = Column(Integer)
