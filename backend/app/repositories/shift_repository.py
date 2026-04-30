import uuid
from typing import Optional
from datetime import date, time
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.shift import Shift
from app.schemas.shift import ShiftCreate, ShiftUpdate
from app.repositories.base_repository import BaseRepository


class ShiftRepository(BaseRepository[Shift, ShiftCreate, ShiftUpdate]):
    async def get_by_employee(self, db: AsyncSession, employee_id: uuid.UUID) -> list[Shift]:
        result = await db.execute(
            select(Shift).where(Shift.employee_id == employee_id).order_by(Shift.shift_date)
        )
        return list(result.scalars().all())

    async def get_by_date_range(
        self,
        db: AsyncSession,
        start_date: date,
        end_date: date,
    ) -> list[Shift]:
        """Get shifts within date range."""
        result = await db.execute(
            select(Shift)
            .where(Shift.shift_date.between(start_date, end_date))
            .order_by(Shift.shift_date, Shift.start_time)
        )
        return list(result.scalars().all())

    async def get_overlapping(
        self,
        db: AsyncSession,
        employee_id: uuid.UUID,
        shift_date: date,
        start_time: time,
        end_time: time,
        exclude_id: Optional[uuid.UUID] = None,
    ) -> Optional[Shift]:
        """Check if shift overlaps with existing shifts for same date."""
        query = select(Shift).where(
            and_(
                Shift.employee_id == employee_id,
                Shift.shift_date == shift_date,
                Shift.start_time < end_time,
                Shift.end_time > start_time,
            )
        )
        if exclude_id:
            query = query.where(Shift.id != exclude_id)
        result = await db.execute(query)
        return result.scalars().first()


shift_repository = ShiftRepository(Shift)
