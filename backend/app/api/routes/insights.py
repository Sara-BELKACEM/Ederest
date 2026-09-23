from typing import List, Dict, Set
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.repositories import (
    StepRepository,
    SessionRepository,
    EventRepository,
    ResponseRepository,
    ThemeRepository,
)
from app.models.event import Event
from app.models.response import Response
from app.schemas.insights import InsightsOut, StepMetric, ThemeOut, TriggerMetric
from app.schemas.response import ResponseOut
from app.services.analysis.clusterer import generate_themes

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("", response_model=InsightsOut)
def get_insights(db: Session = Depends(get_db)):
    step_repo = StepRepository(db)
    session_repo = SessionRepository(db)
    event_repo = EventRepository(db)
    response_repo = ResponseRepository(db)
    theme_repo = ThemeRepository(db)

    steps = step_repo.get_all()
    total_sessions = session_repo.count_total()
    total_responses = response_repo.count_total()
    total_events = event_repo.count_total()

    # Pre-fetch aggregated stats
    rating_stats = response_repo.get_rating_stats_per_step()
    trigger_counts = response_repo.get_trigger_counts()

    # Calculate event-based funnel metrics per step
    # Map step_id -> distinct sessions for step_entered, step_completed
    events = db.query(Event.step_id, Event.event_type, Event.session_id).all()
    
    entered_by_step: Dict[int, Set[str]] = {}
    completed_by_step: Dict[int, Set[str]] = {}
    wrong_clicks_by_step: Dict[int, int] = {}
    idle_timeouts_by_step: Dict[int, int] = {}
    task_completed_sessions: Set[str] = set()

    for s_id, e_type, sess_id in events:
        if e_type == "task_completed":
            task_completed_sessions.add(sess_id)
        if s_id is not None:
            if e_type == "step_entered":
                entered_by_step.setdefault(s_id, set()).add(sess_id)
            elif e_type == "step_completed":
                completed_by_step.setdefault(s_id, set()).add(sess_id)
            elif e_type == "wrong_click":
                wrong_clicks_by_step[s_id] = wrong_clicks_by_step.get(s_id, 0) + 1
            elif e_type == "idle_timeout":
                idle_timeouts_by_step[s_id] = idle_timeouts_by_step.get(s_id, 0) + 1

    step_metrics: List[StepMetric] = []
    first_step_entered = len(entered_by_step.get(1, set())) if steps else 0

    for step in steps:
        entered_cnt = len(entered_by_step.get(step.id, set()))
        completed_cnt = len(completed_by_step.get(step.id, set()))
        drop_off_cnt = max(0, entered_cnt - completed_cnt)
        drop_off_rate = round((drop_off_cnt / entered_cnt * 100), 1) if entered_cnt > 0 else 0.0

        step_stat = rating_stats.get(step.id, {"avg_rating": 0.0, "count": 0})

        step_metrics.append(
            StepMetric(
                step_id=step.id,
                step_number=step.step_number,
                title=step.title,
                instruction=step.instruction,
                entered_count=entered_cnt,
                completed_count=completed_cnt,
                drop_off_count=drop_off_cnt,
                drop_off_rate=drop_off_rate,
                response_count=step_stat["count"],
                average_rating=step_stat["avg_rating"],
                wrong_click_count=wrong_clicks_by_step.get(step.id, 0),
                idle_timeout_count=idle_timeouts_by_step.get(step.id, 0),
            )
        )

    # Overall completion rate (learners finishing task vs entering step 1)
    if first_step_entered > 0:
        overall_completion_rate = round((len(task_completed_sessions) / first_step_entered) * 100, 1)
    else:
        overall_completion_rate = 0.0

    # Trigger breakdown
    trigger_metrics: List[TriggerMetric] = []
    for trig_type, cnt in trigger_counts.items():
        rate = round((cnt / total_responses * 100), 1) if total_responses > 0 else 0.0
        trigger_metrics.append(
            TriggerMetric(
                trigger_type=trig_type,
                count=cnt,
                response_rate=rate
            )
        )

    # Themes (fetch cached or generate if none)
    themes = theme_repo.get_all()
    if not themes and total_responses > 0:
        all_responses = response_repo.get_all()
        comments_payload = [
            {
                "id": r.id,
                "step_id": r.step_id,
                "rating": r.rating,
                "comment": r.comment,
                "trigger_type": r.trigger_type
            }
            for r in all_responses
            if r.comment
        ]
        new_themes = generate_themes(comments_payload)
        themes = theme_repo.replace_all(new_themes)

    # Recent raw comments for the dashboard table
    recent_responses = response_repo.get_all()[:20]

    return InsightsOut(
        total_sessions=total_sessions,
        total_responses=total_responses,
        total_events=total_events,
        overall_completion_rate=overall_completion_rate,
        step_metrics=step_metrics,
        themes=themes,
        trigger_metrics=trigger_metrics,
        recent_comments=recent_responses
    )


@router.post("/refresh", response_model=List[ThemeOut])
def refresh_themes(db: Session = Depends(get_db)):
    """
    Forces a fresh run of the AI clustering layer on the collected comments
    and updates the stored themes table.
    """
    response_repo = ResponseRepository(db)
    theme_repo = ThemeRepository(db)

    all_responses = response_repo.get_all()
    comments_payload = [
        {
            "id": r.id,
            "step_id": r.step_id,
            "rating": r.rating,
            "comment": r.comment,
            "trigger_type": r.trigger_type
        }
        for r in all_responses
        if r.comment
    ]

    new_themes = generate_themes(comments_payload)
    saved_themes = theme_repo.replace_all(new_themes)
    return saved_themes
