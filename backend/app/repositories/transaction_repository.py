import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionRead
from app.repositories.base_repository import BaseRepository
from pydantic import BaseModel


class _NoUpdate(BaseModel):
    pass


class TransactionRepository(BaseRepository[Transaction, TransactionRead, _NoUpdate]):
    async def get_by_date(self, db: AsyncSession, target_date: date) -> list[Transaction]:
        result = await db.execute(
            select(Transaction).where(
                func.date(Transaction.transaction_date) == target_date
            )
        )
        return list(result.scalars().all())

    async def get_by_employee(self, db: AsyncSession, employee_id: uuid.UUID) -> list[Transaction]:
        result = await db.execute(
            select(Transaction).where(Transaction.employee_id == employee_id)
        )
        return list(result.scalars().all())

    async def get_by_vehicle(self, db: AsyncSession, vehicle_id: str) -> list[Transaction]:
        result = await db.execute(
            select(Transaction).where(Transaction.vehicle_id == vehicle_id)
        )
        return list(result.scalars().all())

    async def create_from_exit(
        self,
        db: AsyncSession,
        vehicle_id: str,
        wash_type_id: uuid.UUID,
        employee_id: uuid.UUID,
        amount: float,
        notes: str | None = None,
    ) -> Transaction:
        transaction = Transaction(
            vehicle_id=vehicle_id,
            wash_type_id=wash_type_id,
            employee_id=employee_id,
            amount=amount,
            notes=notes,
        )
        db.add(transaction)
        await db.flush()
        await db.refresh(transaction)
        return transaction


transaction_repository = TransactionRepository(Transaction)
