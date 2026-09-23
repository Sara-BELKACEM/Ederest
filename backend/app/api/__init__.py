from fastapi import APIRouter
from app.api.routes.events import router as events_router
from app.api.routes.responses import router as responses_router
from app.api.routes.insights import router as insights_router
from app.api.routes.seed import router as seed_router

api_router = APIRouter()
api_router.include_router(events_router)
api_router.include_router(responses_router)
api_router.include_router(insights_router)
api_router.include_router(seed_router)

__all__ = ["api_router"]
