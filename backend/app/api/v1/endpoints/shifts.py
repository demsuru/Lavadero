import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, require_manager_or_above
from app.models.employee import Employee
from app.schemas.shift import ShiftCreate, ShiftUpdate, ShiftRead
from app.services.shift_service import shift_service

router = APIRouter()


@router.get("/", response_model=list[ShiftRead])
async def list_shifts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await shift_service.list_shifts(db, skip=skip, limit=limit)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=ShiftRead, status_code=status.HTTP_201_CREATED)
async def create_shift(
    data: ShiftCreate,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await shift_service.create_shift(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/employee/{employee_id}", response_model=list[ShiftRead])
async def get_employee_shifts(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await shift_service.get_employee_shifts(db, employee_id)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{shift_id}", response_model=ShiftRead)
async def get_shift(
    shift_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await shift_service.get_shift(db, shift_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{shift_id}", response_model=ShiftRead)
async def update_shift(
    shift_id: uuid.UUID,
    data: ShiftUpdate,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await shift_service.update_shift(db, shift_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{shift_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shift(
    shift_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        await shift_service.delete_shift(db, shift_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
