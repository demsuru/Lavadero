import uuid
from typing import Optional
from datetime import time
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.shift import Shift, DayOfWeek
from app.schemas.shift import ShiftCreate, ShiftUpdate
from app.repositories.base_repository import BaseRepository


class ShiftRepository(BaseRepository[Shift, ShiftCreate, ShiftUpdate]):
    async def get_by_employee(self, db: AsyncSession, employee_id: uuid.UUID) -> list[Shift]:
        result = await db.execute(
            select(Shift).where(Shift.employee_id == employee_id)
        )
        return list(result.scalars().all())

    async def get_overlapping(
        self,
        db: AsyncSession,
        employee_id: uuid.UUID,
        day_of_week: DayOfWeek,
        start_time: time,
        end_time: time,
        exclude_id: Optional[uuid.UUID] = None,
    ) -> Optional[Shift]:
        """Return any existing shift that overlaps with the given time range."""
        query = select(Shift).where(
            and_(
                Shift.employee_id == employee_id,
                Shift.day_of_week == day_of_week,
                Shift.start_time < end_time,
                Shift.end_time > start_time,
            )
        )
        if exclude_id:
            query = query.where(Shift.id != exclude_id)
        result = await db.execute(query)
        return result.scalars().first()


shift_repository = ShiftRepository(Shift)
