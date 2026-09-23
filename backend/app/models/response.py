from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    step_id = Column(Integer, ForeignKey("steps.id", ondelete="CASCADE"), nullable=False, index=True)
    trigger_type = Column(String(50), nullable=False, index=True)  # idle, wrong_click, navigation, completion
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)  # PII-stripped learner feedback
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    session = relationship("Session", back_populates="responses")
    step = relationship("Step", back_populates="responses")
