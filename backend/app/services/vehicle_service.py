import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.employee import EmployeeStatus
from app.models.wash_type import WashTypeStatus
from app.models.shift import DayOfWeek
from app.schemas.vehicle import VehicleCreate
from app.repositories.vehicle_repository import vehicle_repository
from app.repositories.employee_repository import employee_repository
from app.repositories.wash_type_repository import wash_type_repository
from app.repositories.transaction_repository import transaction_repository


class VehicleService:
    def __init__(self):
        self.repository = vehicle_repository

    async def register_entry(
        self, db: AsyncSession, mongo_db: AsyncIOMotorDatabase, data: VehicleCreate
    ) -> dict:
        try:
            employee_id = uuid.UUID(data.assigned_employee_id)
            wash_type_id = uuid.UUID(data.wash_type_id)

            employee = await employee_repository.get(db, employee_id)
            if not employee:
                raise ValueError("Employee not found")
            if employee.status != EmployeeStatus.active:
                raise ValueError("Employee is not active")

            today_name = datetime.now().strftime("%A").lower()
            today = DayOfWeek(today_name)
            available = await employee_repository.get_available_today(db, today)
            if not any(e.id == employee_id for e in available):
                raise ValueError("Employee does not have a shift today")

            wash_type = await wash_type_repository.get(db, wash_type_id)
            if not wash_type:
                raise ValueError("Wash type not found")
            if wash_type.status != WashTypeStatus.active:
                raise ValueError("Wash type is not active")

            vehicle_doc = data.model_dump()
            return await self.repository.create(mongo_db, vehicle_doc)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error registering vehicle entry: {e}")

    async def register_exit(
        self, db: AsyncSession, mongo_db: AsyncIOMotorDatabase, vehicle_id: str
    ) -> tuple[dict, object]:
        try:
            vehicle = await self.repository.register_exit(mongo_db, vehicle_id)
            if not vehicle:
                raise ValueError("Vehicle not found or is not in progress")

            wash_type_id = uuid.UUID(vehicle["wash_type_id"])
            employee_id = uuid.UUID(vehicle["assigned_employee_id"])

            wash_type = await wash_type_repository.get(db, wash_type_id)
            if not wash_type:
                raise RuntimeError("Wash type not found for transaction")

            transaction = await transaction_repository.create_from_exit(
                db,
                vehicle_id=vehicle_id,
                wash_type_id=wash_type_id,
                employee_id=employee_id,
                amount=wash_type.price,
            )
            return vehicle, transaction
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error registering vehicle exit: {e}")

    async def get_vehicle(self, mongo_db: AsyncIOMotorDatabase, vehicle_id: str) -> dict:
        try:
            vehicle = await self.repository.get(mongo_db, vehicle_id)
            if not vehicle:
                raise ValueError("Vehicle not found")
            return vehicle
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error fetching vehicle: {e}")

    async def list_vehicles(
        self, mongo_db: AsyncIOMotorDatabase, status: str | None = None, skip: int = 0, limit: int = 100
    ) -> list[dict]:
        try:
            return await self.repository.get_multi(mongo_db, status=status, skip=skip, limit=limit)
        except Exception as e:
            raise RuntimeError(f"Error listing vehicles: {e}")

    async def get_in_progress(self, mongo_db: AsyncIOMotorDatabase) -> list[dict]:
        try:
            return await self.repository.get_in_progress(mongo_db)
        except Exception as e:
            raise RuntimeError(f"Error fetching in-progress vehicles: {e}")

    async def update_vehicle(
        self, db: AsyncSession, mongo_db: AsyncIOMotorDatabase, vehicle_id: str,
        assigned_employee_id: str | None = None, entry_timestamp: object | None = None
    ) -> dict:
        try:
            updates = {}
            if assigned_employee_id:
                employee = await employee_repository.get(db, uuid.UUID(assigned_employee_id))
                if not employee:
                    raise ValueError("Employee not found")
                if employee.status != EmployeeStatus.active:
                    raise ValueError("Employee is not active")
                updates["assigned_employee_id"] = assigned_employee_id

            if entry_timestamp:
                updates["entry_timestamp"] = entry_timestamp

            if not updates:
                raise ValueError("No fields to update")

            vehicle = await self.repository.update(mongo_db, vehicle_id, updates)
            if not vehicle:
                raise ValueError("Vehicle not found or is not in progress")
            return vehicle
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error updating vehicle: {e}")


vehicle_service = VehicleService()
