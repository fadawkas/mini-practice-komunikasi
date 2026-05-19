import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.models import Session as SessionModel
from app.routers import practice, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


def init_database():
    """Create tables and seed default session."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(SessionModel).filter(
            SessionModel.code == "komunikasi-internal-2026"
        ).first()
        if not existing:
            default_session = SessionModel(
                code="komunikasi-internal-2026",
                title="Mini Practice Komunikasi Internal",
                is_active=True,
            )
            db.add(default_session)
            db.commit()
            logger.info("Default session seeded: komunikasi-internal-2026")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up... Initializing database.")
    init_database()
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="Mini Practice Komunikasi Internal",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(practice.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Mini Practice Komunikasi Internal API is running"}