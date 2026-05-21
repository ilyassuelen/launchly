from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
)

from backend.app.core.database import Base


class ResumeProject(Base):
    __tablename__ = "resume_projects"

    id = Column(Integer, primary_key=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    title = Column(String)
    stack = Column(String)

    bullets = Column(Text)

    github_url = Column(String)
    live_url = Column(String)

    order_index = Column(Integer)
