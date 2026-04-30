import uuid
from datetime import date, timedelta
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
            today = date.today()
            max_future_date = today + timedelta(days=30)

            # Validar que shift_date no sea en el pasado
            if data.shift_date < today:
                raise ValueError("Cannot create shifts in the past")

            # Validar límite máximo de anticipación (1 mes)
            if data.shift_date > max_future_date:
                raise ValueError(f"Cannot create shifts more than 1 month in advance (max: {max_future_date.strftime('%d/%m/%Y')})")

            employee = await employee_repository.get(db, data.employee_id)
            if not employee:
                raise ValueError("Employee not found")
            if employee.status != EmployeeStatus.active:
                raise ValueError("Cannot assign shift to inactive employee")

            overlap = await self.repository.get_overlapping(
                db, data.employee_id, data.shift_date, data.start_time, data.end_time
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

    async def get_shifts_for_week(self, db: AsyncSession, week_start: date) -> list[Shift]:
        """Get all shifts for a week (Monday-Sunday)."""
        try:
            # Ensure week_start is a Monday (ISO weekday: Monday=0)
            week_start = week_start - timedelta(days=week_start.weekday())
            week_end = week_start + timedelta(days=6)  # Sunday

            return await self.repository.get_by_date_range(db, week_start, week_end)
        except Exception as e:
            raise RuntimeError(f"Error fetching shifts for week: {e}")

    async def update_shift(self, db: AsyncSession, shift_id: uuid.UUID, data: ShiftUpdate) -> Shift:
        try:
            shift = await self.repository.get(db, shift_id)
            if not shift:
                raise ValueError("Shift not found")

            # Validar que no sea turno pasado (read-only)
            if shift.shift_date < date.today():
                raise ValueError("Cannot modify shifts in the past (read-only)")

            new_date = data.shift_date or shift.shift_date
            new_start = data.start_time or shift.start_time
            new_end = data.end_time or shift.end_time

            # Validar que la nueva fecha no sea en el pasado
            if new_date < date.today():
                raise ValueError("Cannot move shift to a past date")

            # Validar límite máximo de anticipación
            today = date.today()
            max_future_date = today + timedelta(days=30)
            if new_date > max_future_date:
                raise ValueError(f"Cannot move shift beyond 1 month in advance (max: {max_future_date.strftime('%d/%m/%Y')})")

            if new_end <= new_start:
                raise ValueError("end_time must be after start_time")

            overlap = await self.repository.get_overlapping(
                db, shift.employee_id, new_date, new_start, new_end, exclude_id=shift_id
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
            shift = await self.repository.get(db, shift_id)
            if not shift:
                raise ValueError("Shift not found")

            # Validar que no sea turno pasado (read-only)
            if shift.shift_date < date.today():
                raise ValueError("Cannot delete shifts in the past (read-only)")

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
