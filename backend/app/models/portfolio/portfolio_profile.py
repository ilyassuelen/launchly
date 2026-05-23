from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class PortfolioProfile(Base):
    __tablename__ = "portfolio_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    github_username = Column(String, default="", nullable=False)
    language = Column(String, default="english", nullable=False)
    analysis = Column(JSON, nullable=True)

    user = relationship("User")
