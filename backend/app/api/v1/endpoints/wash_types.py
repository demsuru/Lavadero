import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, require_manager_or_above, require_admin_or_above
from app.models.employee import Employee
from app.schemas.wash_type import WashTypeCreate, WashTypeUpdate, WashTypeRead
from app.services.wash_type_service import wash_type_service

router = APIRouter()


@router.get("/", response_model=list[WashTypeRead])
async def list_wash_types(
    only_active: bool = False,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await wash_type_service.list_wash_types(db, only_active=only_active)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=WashTypeRead, status_code=status.HTTP_201_CREATED)
async def create_wash_type(
    data: WashTypeCreate,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_admin_or_above),
):
    try:
        return await wash_type_service.create_wash_type(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{wash_type_id}", response_model=WashTypeRead)
async def get_wash_type(
    wash_type_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await wash_type_service.get_wash_type(db, wash_type_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{wash_type_id}", response_model=WashTypeRead)
async def update_wash_type(
    wash_type_id: uuid.UUID,
    data: WashTypeUpdate,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_admin_or_above),
):
    try:
        return await wash_type_service.update_wash_type(db, wash_type_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{wash_type_id}", response_model=WashTypeRead)
async def deactivate_wash_type(
    wash_type_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_admin_or_above),
):
    """Soft delete — sets wash type status to inactive. Admin-only."""
    try:
        return await wash_type_service.deactivate_wash_type(db, wash_type_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
