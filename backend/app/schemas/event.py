from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class EventCreate(BaseModel):
    session_id: str = Field(..., description="Anonymous session identifier")
    step_id: Optional[int] = Field(None, description="Step ID (1-4) or null for global/task level")
    event_type: str = Field(..., description="e.g. step_entered, step_completed, wrong_click, idle_timeout, task_left, task_completed")
    details: Optional[str] = Field(None, description="Additional context or target clicked")

class EventOut(BaseModel):
    id: int
    session_id: str
    step_id: Optional[int]
    event_type: str
    details: Optional[str]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
