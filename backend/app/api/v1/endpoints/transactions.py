import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, require_manager_or_above
from app.models.employee import Employee
from app.schemas.transaction import TransactionRead
from app.services.transaction_service import transaction_service

router = APIRouter()


@router.get("/", response_model=list[TransactionRead])
async def list_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await transaction_service.list_transactions(db, skip=skip, limit=limit)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/date/{target_date}", response_model=list[TransactionRead])
async def get_transactions_by_date(
    target_date: date,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await transaction_service.get_by_date(db, target_date)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{transaction_id}", response_model=TransactionRead)
async def get_transaction(
    transaction_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: Employee = Depends(require_manager_or_above),
):
    try:
        return await transaction_service.get_transaction(db, transaction_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
