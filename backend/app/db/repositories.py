from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.step import Step
from app.models.session import Session as SessionModel
from app.models.event import Event
from app.models.response import Response
from app.models.theme import Theme

class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, session_id: str) -> Optional[SessionModel]:
        return self.db.query(SessionModel).filter(SessionModel.id == session_id).first()

    def get_or_create(self, session_id: str) -> SessionModel:
        session = self.get_by_id(session_id)
        if not session:
            session = SessionModel(id=session_id)
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
        return session

    def count_total(self) -> int:
        return self.db.query(func.count(SessionModel.id)).scalar() or 0


class StepRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Step]:
        return self.db.query(Step).order_by(Step.step_number.asc()).all()

    def get_by_id(self, step_id: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.id == step_id).first()

    def get_by_step_number(self, step_number: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.step_number == step_number).first()

    def create(self, step_id: int, step_number: int, title: str, instruction: str, hint_text: Optional[str] = None) -> Step:
        step = Step(
            id=step_id,
            step_number=step_number,
            title=title,
            instruction=instruction,
            hint_text=hint_text
        )
        self.db.add(step)
        self.db.commit()
        self.db.refresh(step)
        return step


class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, session_id: str, step_id: Optional[int], event_type: str, details: Optional[str] = None) -> Event:
        event = Event(
            session_id=session_id,
            step_id=step_id,
            event_type=event_type,
            details=details
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_all(self, session_id: Optional[str] = None) -> List[Event]:
        query = self.db.query(Event)
        if session_id:
            query = query.filter(Event.session_id == session_id)
        return query.order_by(Event.timestamp.asc()).all()

    def count_by_step_and_type(self) -> Dict[tuple, int]:
        # returns mapping of (step_id, event_type) -> count
        results = (
            self.db.query(Event.step_id, Event.event_type, func.count(Event.id))
            .group_by(Event.step_id, Event.event_type)
            .all()
        )
        return {(row[0], row[1]): row[2] for row in results}

    def count_total(self) -> int:
        return self.db.query(func.count(Event.id)).scalar() or 0


class ResponseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        session_id: str,
        step_id: int,
        trigger_type: str,
        rating: int,
        comment: Optional[str] = None
    ) -> Response:
        response = Response(
            session_id=session_id,
            step_id=step_id,
            trigger_type=trigger_type,
            rating=rating,
            comment=comment
        )
        self.db.add(response)
        self.db.commit()
        self.db.refresh(response)
        return response

    def get_all(self, step_id: Optional[int] = None) -> List[Response]:
        query = self.db.query(Response)
        if step_id is not None:
            query = query.filter(Response.step_id == step_id)
        return query.order_by(Response.timestamp.desc()).all()

    def count_total(self) -> int:
        return self.db.query(func.count(Response.id)).scalar() or 0

    def get_rating_stats_per_step(self) -> Dict[int, Dict[str, Any]]:
        # Returns {step_id: {"avg_rating": float, "count": int}}
        results = (
            self.db.query(
                Response.step_id,
                func.avg(Response.rating),
                func.count(Response.id)
            )
            .group_by(Response.step_id)
            .all()
        )
        stats = {}
        for row in results:
            step_id, avg_r, cnt = row
            stats[step_id] = {
                "avg_rating": round(float(avg_r), 2) if avg_r is not None else 0.0,
                "count": cnt or 0
            }
        return stats

    def get_trigger_counts(self) -> Dict[str, int]:
        results = (
            self.db.query(Response.trigger_type, func.count(Response.id))
            .group_by(Response.trigger_type)
            .all()
        )
        return {row[0]: row[1] for row in results}


class ThemeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Theme]:
        return self.db.query(Theme).order_by(Theme.comment_count.desc(), Theme.id.asc()).all()

    def replace_all(self, theme_data_list: List[Dict[str, Any]]) -> List[Theme]:
        # Delete existing themes and insert fresh ones
        self.db.query(Theme).delete()
        created_themes = []
        for item in theme_data_list:
            theme = Theme(
                label=item["label"],
                summary=item["summary"],
                comment_count=item.get("comment_count", 0),
                step_ids=item.get("step_ids", []),
                suggested_action=item.get("suggested_action"),
                sentiment=item.get("sentiment", "neutral")
            )
            self.db.add(theme)
            created_themes.append(theme)
        self.db.commit()
        for t in created_themes:
            self.db.refresh(t)
        return created_themes
