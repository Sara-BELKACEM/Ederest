from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.repositories import ResponseRepository, SessionRepository
from app.schemas.response import ResponseCreate, ResponseOut
from app.services.privacy.stripper import strip_pii

router = APIRouter(prefix="/responses", tags=["Responses"])

@router.post("", response_model=ResponseOut, status_code=status.HTTP_201_CREATED)
def submit_response(
    response_in: ResponseCreate,
    db: Session = Depends(get_db)
):
    session_repo = SessionRepository(db)
    response_repo = ResponseRepository(db)

    # Ensure anonymous session exists
    session_repo.get_or_create(response_in.session_id)

    # Strip any PII (emails, phone numbers) before persisting to DB
    clean_comment = strip_pii(response_in.comment)

    # Save survey response
    response = response_repo.create(
        session_id=response_in.session_id,
        step_id=response_in.step_id,
        trigger_type=response_in.trigger_type,
        rating=response_in.rating,
        comment=clean_comment
    )
    return response

@router.get("", response_model=List[ResponseOut])
def list_responses(
    step_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    response_repo = ResponseRepository(db)
    return response_repo.get_all(step_id=step_id)
