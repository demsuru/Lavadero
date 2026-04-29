from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.api.dependencies import get_db, get_mongo_db, require_manager_or_above
from app.models.employee import Employee
from app.services.dashboard_service import dashboard_service

router = APIRouter()


class DashboardTodayStats(BaseModel):
    completed_count: int
    revenue_today: float


@router.get("/today", response_model=DashboardTodayStats)
async def get_today_stats(
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        stats = await dashboard_service.get_today_stats(db, mongo_db)
        return DashboardTodayStats(**stats)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
