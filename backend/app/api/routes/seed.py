from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.seed.loader import load_seed_data

router = APIRouter(prefix="/seed", tags=["Seed"])

@router.post("")
def seed_database(
    force: bool = Query(False, description="Force overwrite existing data"),
    db: Session = Depends(get_db)
):
    """
    Populates database with realistic sample steps, sessions, events,
    and survey responses.
    """
    result = load_seed_data(db, force=force)
    return result
