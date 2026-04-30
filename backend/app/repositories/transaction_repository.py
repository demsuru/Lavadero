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

    async def get_by_date_range(self, db: AsyncSession, start_date: date, end_date: date) -> list[Transaction]:
        result = await db.execute(
            select(Transaction).where(
                func.date(Transaction.transaction_date).between(start_date, end_date)
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

    async def get_daily_revenue(self, db: AsyncSession, start_date: date, end_date: date) -> list[dict]:
        result = await db.execute(
            select(
                func.date(Transaction.transaction_date).label("day"),
                func.sum(Transaction.amount).label("revenue"),
                func.count(Transaction.id).label("count"),
            ).where(
                func.date(Transaction.transaction_date).between(start_date, end_date)
            ).group_by(
                func.date(Transaction.transaction_date)
            ).order_by(
                func.date(Transaction.transaction_date)
            )
        )
        return [{"day": row.day, "revenue": float(row.revenue or 0), "count": row.count} for row in result.all()]

    async def get_stats_by_employee(self, db: AsyncSession, start_date: date, end_date: date) -> list[dict]:
        result = await db.execute(
            select(
                Transaction.employee_id,
                func.count(Transaction.id).label("total_cars"),
                func.sum(Transaction.amount).label("total_revenue"),
            ).where(
                func.date(Transaction.transaction_date).between(start_date, end_date)
            ).group_by(
                Transaction.employee_id
            ).order_by(
                func.count(Transaction.id).desc()
            )
        )
        return [{"employee_id": row.employee_id, "total_cars": row.total_cars, "total_revenue": float(row.total_revenue or 0)} for row in result.all()]

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
