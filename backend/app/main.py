from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import engine, ensure_database_exists, AsyncSessionLocal
from app.core.mongodb import connect as mongo_connect, disconnect as mongo_disconnect
from app.core.bootstrap import ensure_initial_admin
from app.models.base import Base
import app.models  # noqa: F401 — registers all models with SQLAlchemy
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_database_exists()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await mongo_connect()
    await ensure_initial_admin(AsyncSessionLocal)
    yield
    await mongo_disconnect()


app = FastAPI(
    title="Car Wash Management API",
    version="1.0.0",
    description="API for managing daily car wash operations",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
