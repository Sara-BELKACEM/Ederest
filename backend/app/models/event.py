from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    step_id = Column(Integer, ForeignKey("steps.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    details = Column(Text, nullable=True)  # JSON or descriptive payload
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    session = relationship("Session", back_populates="events")
    step = relationship("Step", back_populates="events")
