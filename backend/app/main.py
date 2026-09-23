import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.database import init_db, SessionLocal
from app.api import api_router
from app.seed.loader import load_seed_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ederest-backend")

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables and seed if empty
    logger.info("Initializing database...")
    init_db()
    
    # Auto-seed initial demo data if database is fresh
    db = SessionLocal()
    try:
        seed_result = load_seed_data(db, force=False)
        logger.info(f"Database seed check: {seed_result}")
    except Exception as e:
        logger.error(f"Error during auto-seed: {e}")
    finally:
        db.close()
        
    yield
    # Teardown logic if needed

app = FastAPI(
    title="EDEREST Learner Feedback Loop API",
    description="Privacy-first feedback collection & AI-driven insights for guided software practice tasks.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "EDEREST Learner Feedback Loop API",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
