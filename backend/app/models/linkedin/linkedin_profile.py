from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class LinkedInProfile(Base):
    __tablename__ = "linkedin_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    language = Column(String, default="english", nullable=False)
    headline = Column(Text, default="", nullable=False)
    about = Column(Text, default="", nullable=False)
    skills = Column(JSON, default=list, nullable=False)
    projects = Column(JSON, default=list, nullable=False)
    target_role = Column(String, default="", nullable=False)

    analysis = Column(JSON, nullable=True)

    user = relationship("User")