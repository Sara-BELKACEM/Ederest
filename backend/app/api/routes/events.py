from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.repositories import EventRepository, SessionRepository
from app.schemas.event import EventCreate, EventOut

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def record_event(
    event_in: EventCreate,
    db: Session = Depends(get_db)
):
    session_repo = SessionRepository(db)
    event_repo = EventRepository(db)

    # Ensure anonymous session exists
    session_repo.get_or_create(event_in.session_id)

    # Store event
    event = event_repo.create(
        session_id=event_in.session_id,
        step_id=event_in.step_id,
        event_type=event_in.event_type,
        details=event_in.details
    )
    return event

@router.get("", response_model=List[EventOut])
def list_events(
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    event_repo = EventRepository(db)
    return event_repo.get_all(session_id=session_id)
