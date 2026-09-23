from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from .base import Base

class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key=True, index=True)
    step_number = Column(Integer, unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    instruction = Column(Text, nullable=False)
    hint_text = Column(Text, nullable=True)

    events = relationship("Event", back_populates="step", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="step", cascade="all, delete-orphan")
