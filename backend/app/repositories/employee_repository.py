import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, exists
from app.models.employee import Employee, EmployeeStatus
from app.models.shift import Shift, DayOfWeek
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.repositories.base_repository import BaseRepository


class EmployeeRepository(BaseRepository[Employee, EmployeeCreate, EmployeeUpdate]):
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[Employee]:
        result = await db.execute(select(Employee).where(Employee.email == email))
        return result.scalars().first()

    async def get_all_active(self, db: AsyncSession) -> list[Employee]:
        result = await db.execute(
            select(Employee).where(Employee.status == EmployeeStatus.active)
        )
        return list(result.scalars().all())

    async def get_available_today(self, db: AsyncSession, today: DayOfWeek) -> list[Employee]:
        """Return active employees who have a shift on the given day."""
        result = await db.execute(
            select(Employee)
            .where(Employee.status == EmployeeStatus.active)
            .where(
                exists().where(
                    Shift.employee_id == Employee.id,
                    Shift.day_of_week == today,
                )
            )
        )
        return list(result.scalars().all())

    async def deactivate(self, db: AsyncSession, id: uuid.UUID) -> Optional[Employee]:
        employee = await self.get(db, id)
        if employee:
            employee.status = EmployeeStatus.inactive
            await db.flush()
            await db.refresh(employee)
        return employee


employee_repository = EmployeeRepository(Employee)
