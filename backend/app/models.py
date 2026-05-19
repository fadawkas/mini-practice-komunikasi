from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    participant_name = Column(String(100), nullable=False)
    bad_communication_example = Column(Text, nullable=False)
    participant_answer = Column(Text, nullable=True)
    score_clarity = Column(Integer, nullable=True)
    score_completeness = Column(Integer, nullable=True)
    score_tone = Column(Integer, nullable=True)
    score_actionability = Column(Integer, nullable=True)
    total_score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())