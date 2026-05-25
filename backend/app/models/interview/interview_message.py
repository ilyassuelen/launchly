from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
)

from backend.app.core.database import Base


class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)

    question_index = Column(Integer, nullable=True)

    message_type = Column(
        String,
        nullable=False,
        default="message",
    )

    meta = Column(JSON, nullable=False, default=dict)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
