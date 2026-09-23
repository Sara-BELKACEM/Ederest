from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from .base import Base

class Theme(Base):
    __tablename__ = "themes"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    label = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    comment_count = Column(Integer, default=0, nullable=False)
    step_ids = Column(JSON, nullable=False, default=list)  # e.g. [2, 3]
    suggested_action = Column(Text, nullable=True)
    sentiment = Column(String(50), nullable=True)  # positive, neutral, negative
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
