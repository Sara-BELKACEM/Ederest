import os
import json
import logging
from typing import Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.step import Step
from app.models.session import Session as SessionModel
from app.models.event import Event
from app.models.response import Response
from app.services.privacy.stripper import strip_pii
from app.services.analysis.clusterer import generate_themes
from app.db.repositories import ThemeRepository

logger = logging.getLogger(__name__)

def load_seed_data(db: Session, force: bool = False) -> Dict[str, Any]:
    """
    Loads JSON seed files from data/seed/ into the SQLite/PostgreSQL database.
    If database already contains steps, it skips unless force=True.
    """
    existing_steps = db.query(Step).count()
    if existing_steps > 0 and not force:
        return {"status": "skipped", "message": "Database already contains seed data."}

    # If force, clear existing data
    if force:
        db.query(Response).delete()
        db.query(Event).delete()
        db.query(Step).delete()
        db.query(SessionModel).delete()
        db.commit()

    # Paths to seed files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    seed_dir = os.path.join(base_dir, "data", "seed")

    steps_path = os.path.join(seed_dir, "steps.json")
    sessions_path = os.path.join(seed_dir, "sessions.json")
    events_path = os.path.join(seed_dir, "events.json")
    responses_path = os.path.join(seed_dir, "responses.json")

    # 1. Load Steps
    steps_count = 0
    if os.path.exists(steps_path):
        with open(steps_path, "r", encoding="utf-8") as f:
            steps_data = json.load(f)
            for item in steps_data:
                step = Step(
                    id=item["id"],
                    step_number=item["step_number"],
                    title=item["title"],
                    instruction=item["instruction"],
                    hint_text=item.get("hint_text")
                )
                db.add(step)
                steps_count += 1
        db.commit()

    # 2. Load Sessions
    sessions_count = 0
    if os.path.exists(sessions_path):
        with open(sessions_path, "r", encoding="utf-8") as f:
            sessions_data = json.load(f)
            for item in sessions_data:
                dt = datetime.fromisoformat(item["created_at"]) if "created_at" in item else datetime.utcnow()
                session = SessionModel(
                    id=item["id"],
                    created_at=dt
                )
                db.add(session)
                sessions_count += 1
        db.commit()

    # 3. Load Events
    events_count = 0
    if os.path.exists(events_path):
        with open(events_path, "r", encoding="utf-8") as f:
            events_data = json.load(f)
            for item in events_data:
                dt = datetime.fromisoformat(item["timestamp"]) if "timestamp" in item else datetime.utcnow()
                event = Event(
                    session_id=item["session_id"],
                    step_id=item.get("step_id"),
                    event_type=item["event_type"],
                    details=item.get("details"),
                    timestamp=dt
                )
                db.add(event)
                events_count += 1
        db.commit()

    # 4. Load Responses (Ensuring PII stripping is applied)
    responses_count = 0
    loaded_comments = []
    if os.path.exists(responses_path):
        with open(responses_path, "r", encoding="utf-8") as f:
            responses_data = json.load(f)
            for item in responses_data:
                dt = datetime.fromisoformat(item["timestamp"]) if "timestamp" in item else datetime.utcnow()
                cleaned_comment = strip_pii(item.get("comment"))
                response = Response(
                    session_id=item["session_id"],
                    step_id=item["step_id"],
                    trigger_type=item["trigger_type"],
                    rating=item["rating"],
                    comment=cleaned_comment,
                    timestamp=dt
                )
                db.add(response)
                responses_count += 1
                if cleaned_comment:
                    loaded_comments.append({
                        "id": responses_count,
                        "step_id": item["step_id"],
                        "rating": item["rating"],
                        "comment": cleaned_comment,
                        "trigger_type": item["trigger_type"]
                    })
        db.commit()

    # 5. Pre-generate and cache initial themes so dashboard has immediate rich AI themes
    theme_repo = ThemeRepository(db)
    generated = generate_themes(loaded_comments)
    theme_repo.replace_all(generated)

    return {
        "status": "success",
        "steps_loaded": steps_count,
        "sessions_loaded": sessions_count,
        "events_loaded": events_count,
        "responses_loaded": responses_count,
        "themes_generated": len(generated)
    }
