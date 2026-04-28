import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.shift import Shift
from app.schemas.shift import ShiftCreate, ShiftUpdate
from app.repositories.shift_repository import shift_repository
from app.repositories.employee_repository import employee_repository
from app.models.employee import EmployeeStatus


class ShiftService:
    def __init__(self):
        self.repository = shift_repository

    async def create_shift(self, db: AsyncSession, data: ShiftCreate) -> Shift:
        try:
            employee = await employee_repository.get(db, data.employee_id)
            if not employee:
                raise ValueError("Employee not found")
            if employee.status != EmployeeStatus.active:
                raise ValueError("Cannot assign shift to inactive employee")

            overlap = await self.repository.get_overlapping(
                db, data.employee_id, data.day_of_week, data.start_time, data.end_time
            )
            if overlap:
                raise ValueError("Shift overlaps with an existing shift for this employee")

            return await self.repository.create(db, data)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error creating shift: {e}")

    async def get_shift(self, db: AsyncSession, shift_id: uuid.UUID) -> Shift:
        try:
            shift = await self.repository.get(db, shift_id)
            if not shift:
                raise ValueError("Shift not found")
            return shift
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error fetching shift: {e}")

    async def list_shifts(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Shift]:
        try:
            return await self.repository.get_multi(db, skip=skip, limit=limit)
        except Exception as e:
            raise RuntimeError(f"Error listing shifts: {e}")

    async def update_shift(self, db: AsyncSession, shift_id: uuid.UUID, data: ShiftUpdate) -> Shift:
        try:
            shift = await self.repository.get(db, shift_id)
            if not shift:
                raise ValueError("Shift not found")

            new_day = data.day_of_week or shift.day_of_week
            new_start = data.start_time or shift.start_time
            new_end = data.end_time or shift.end_time

            if new_end <= new_start:
                raise ValueError("end_time must be after start_time")

            overlap = await self.repository.get_overlapping(
                db, shift.employee_id, new_day, new_start, new_end, exclude_id=shift_id
            )
            if overlap:
                raise ValueError("Updated shift overlaps with an existing shift for this employee")

            return await self.repository.update(db, shift, data)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error updating shift: {e}")

    async def delete_shift(self, db: AsyncSession, shift_id: uuid.UUID) -> bool:
        try:
            deleted = await self.repository.delete(db, shift_id)
            if not deleted:
                raise ValueError("Shift not found")
            return True
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error deleting shift: {e}")

    async def get_employee_shifts(self, db: AsyncSession, employee_id: uuid.UUID) -> list[Shift]:
        try:
            return await self.repository.get_by_employee(db, employee_id)
        except Exception as e:
            raise RuntimeError(f"Error fetching employee shifts: {e}")


shift_service = ShiftService()
