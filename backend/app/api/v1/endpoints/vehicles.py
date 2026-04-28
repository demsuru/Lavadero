from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_db, get_mongo_db, require_manager_or_above
from app.models.employee import Employee
from app.schemas.vehicle import VehicleCreate, VehicleRead, VehicleExitRead
from app.services.vehicle_service import vehicle_service

router = APIRouter()


@router.get("/in-progress", response_model=list[VehicleRead])
async def get_in_progress(
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await vehicle_service.get_in_progress(mongo_db)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list[VehicleRead])
async def list_vehicles(
    status: str | None = None,
    skip: int = 0,
    limit: int = 100,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await vehicle_service.list_vehicles(mongo_db, status=status, skip=skip, limit=limit)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=VehicleRead, status_code=status.HTTP_201_CREATED)
async def register_entry(
    data: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await vehicle_service.register_entry(db, mongo_db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{vehicle_id}", response_model=VehicleRead)
async def get_vehicle(
    vehicle_id: str,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await vehicle_service.get_vehicle(mongo_db, vehicle_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{vehicle_id}/exit", response_model=VehicleExitRead)
async def register_exit(
    vehicle_id: str,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        vehicle, transaction = await vehicle_service.register_exit(db, mongo_db, vehicle_id)
        return VehicleExitRead(vehicle=vehicle, transaction_id=str(transaction.id))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
