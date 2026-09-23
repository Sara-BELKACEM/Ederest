from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .response import ResponseOut

class StepMetric(BaseModel):
    step_id: int
    step_number: int
    title: str
    instruction: str
    entered_count: int
    completed_count: int
    drop_off_count: int
    drop_off_rate: float
    response_count: int
    average_rating: float
    wrong_click_count: int
    idle_timeout_count: int

class ThemeOut(BaseModel):
    id: int
    label: str
    summary: str
    comment_count: int
    step_ids: List[int]
    suggested_action: Optional[str] = None
    sentiment: Optional[str] = None
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TriggerMetric(BaseModel):
    trigger_type: str
    count: int
    response_rate: float

class InsightsOut(BaseModel):
    total_sessions: int
    total_responses: int
    total_events: int
    overall_completion_rate: float
    step_metrics: List[StepMetric]
    themes: List[ThemeOut]
    trigger_metrics: List[TriggerMetric]
    recent_comments: List[ResponseOut]
