import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import (
    get_db,
    require_manager_or_above,
    require_admin_or_above,
)
from app.models.employee import Employee, ADMIN_ROLES
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeRead
from app.services.employee_service import employee_service

router = APIRouter()


@router.get("/", response_model=list[EmployeeRead])
async def list_employees(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await employee_service.list_employees(db, skip=skip, limit=limit)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
async def create_employee(
    data: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(require_manager_or_above),
):
    # Only admins/superadmins can create users with admin/superadmin roles
    if data.role in ADMIN_ROLES and current_user.role not in ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create admin or superadmin users",
        )
    try:
        return await employee_service.create_employee(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/available", response_model=list[EmployeeRead])
async def get_available_employees(
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    """Return active employees who have a shift today."""
    try:
        return await employee_service.get_available_today(db)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await employee_service.get_employee(db, employee_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{employee_id}", response_model=EmployeeRead)
async def update_employee(
    employee_id: uuid.UUID,
    data: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(require_manager_or_above),
):
    # A manager cannot escalate someone to admin/superadmin
    if data.role in ADMIN_ROLES and current_user.role not in ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can promote users to admin or superadmin",
        )
    try:
        return await employee_service.update_employee(db, employee_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{employee_id}", response_model=EmployeeRead)
async def deactivate_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(require_admin_or_above),
):
    """Soft delete — sets employee status to inactive. Admin-only."""
    if employee_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate yourself")
    try:
        return await employee_service.deactivate_employee(db, employee_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
