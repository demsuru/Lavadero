from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.api.dependencies import get_db, get_mongo_db, require_admin_or_above
from app.models.employee import Employee
from app.services.report_service import report_service
from app.schemas.report import PeriodSummary, DailyRevenue, EmployeeStats, VehicleSearchResult

router = APIRouter()


@router.get("/summary", response_model=PeriodSummary)
async def get_period_summary(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_admin_or_above),
):
    """Get summary statistics for a date range."""
    try:
        result = await report_service.get_period_summary(db, mongo_db, start_date, end_date)
        return PeriodSummary(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/revenue-chart", response_model=list[DailyRevenue])
async def get_revenue_chart(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_admin_or_above),
):
    """Get daily revenue data for chart visualization."""
    try:
        result = await report_service.get_daily_revenue_chart(db, start_date, end_date)
        return [DailyRevenue(**item) for item in result]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/employee-stats", response_model=list[EmployeeStats])
async def get_employee_stats(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_admin_or_above),
):
    """Get vehicle wash statistics per employee."""
    try:
        result = await report_service.get_employee_stats(db, start_date, end_date)
        return [EmployeeStats(**item) for item in result]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/vehicles/search", response_model=list[VehicleSearchResult])
async def search_vehicles(
    plate: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_admin_or_above),
):
    """Search vehicles by plate or date range."""
    try:
        if not plate and not date_from and not date_to:
            raise ValueError("Provide at least one search criterion (plate, date_from, or date_to)")

        result = await report_service.search_vehicles(mongo_db, plate=plate, date_from=date_from, date_to=date_to)
        return [VehicleSearchResult(**item) for item in result]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
