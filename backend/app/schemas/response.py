from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ResponseCreate(BaseModel):
    session_id: str = Field(..., description="Anonymous session identifier")
    step_id: int = Field(..., description="Step ID context (1-4)")
    trigger_type: str = Field(..., description="idle, wrong_click, navigation, completion")
    rating: int = Field(..., ge=1, le=5, description="Learner rating from 1 to 5")
    comment: Optional[str] = Field(None, description="Learner feedback (will be stripped of PII)")

class ResponseOut(BaseModel):
    id: int
    session_id: str
    step_id: int
    trigger_type: str
    rating: int
    comment: Optional[str]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
