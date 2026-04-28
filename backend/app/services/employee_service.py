import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password
from app.models.shift import DayOfWeek
from app.models.employee import Employee, EmployeeRole, LOGIN_ROLES
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.repositories.employee_repository import employee_repository


class EmployeeService:
    def __init__(self):
        self.repository = employee_repository

    async def create_employee(self, db: AsyncSession, data: EmployeeCreate) -> Employee:
        try:
            self._validate_role_credentials(role=data.role, email=data.email, password=data.password)

            if data.email:
                existing = await self.repository.get_by_email(db, data.email)
                if existing:
                    raise ValueError("Email already registered")

            employee = Employee(
                name=data.name,
                email=data.email,
                phone=data.phone,
                role=data.role,
                password_hash=hash_password(data.password) if data.password else None,
            )
            db.add(employee)
            await db.flush()
            await db.refresh(employee)
            return employee
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error creating employee: {e}")

    async def get_employee(self, db: AsyncSession, employee_id: uuid.UUID) -> Employee:
        try:
            employee = await self.repository.get(db, employee_id)
            if not employee:
                raise ValueError("Employee not found")
            return employee
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error fetching employee: {e}")

    async def list_employees(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Employee]:
        try:
            return await self.repository.get_multi(db, skip=skip, limit=limit)
        except Exception as e:
            raise RuntimeError(f"Error listing employees: {e}")

    async def update_employee(self, db: AsyncSession, employee_id: uuid.UUID, data: EmployeeUpdate) -> Employee:
        try:
            employee = await self.repository.get(db, employee_id)
            if not employee:
                raise ValueError("Employee not found")

            new_role = data.role or employee.role
            new_email = data.email if data.email is not None else employee.email
            # Password set in this update OR already on record
            has_password = data.password or employee.password_hash is not None
            self._validate_role_credentials(
                role=new_role,
                email=new_email,
                password="set" if has_password else None,
            )

            if data.email and data.email != employee.email:
                existing = await self.repository.get_by_email(db, data.email)
                if existing:
                    raise ValueError("Email already registered")

            update_fields = data.model_dump(exclude_unset=True, exclude={"password"})
            for field, value in update_fields.items():
                setattr(employee, field, value)

            if data.password:
                employee.password_hash = hash_password(data.password)

            await db.flush()
            await db.refresh(employee)
            return employee
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error updating employee: {e}")

    async def deactivate_employee(self, db: AsyncSession, employee_id: uuid.UUID) -> Employee:
        try:
            employee = await self.repository.deactivate(db, employee_id)
            if not employee:
                raise ValueError("Employee not found")
            return employee
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error deactivating employee: {e}")

    async def get_available_today(self, db: AsyncSession) -> list[Employee]:
        try:
            today_name = datetime.now().strftime("%A").lower()
            today = DayOfWeek(today_name)
            return await self.repository.get_available_today(db, today)
        except Exception as e:
            raise RuntimeError(f"Error fetching available employees: {e}")

    @staticmethod
    def _validate_role_credentials(role: EmployeeRole, email: str | None, password: str | None) -> None:
        """Login-capable roles require email and password; plain employees must not have a password."""
        if role in LOGIN_ROLES:
            if not email:
                raise ValueError(f"Role '{role.value}' requires an email to log in")
            if not password:
                raise ValueError(f"Role '{role.value}' requires a password")
        elif role == EmployeeRole.employee and password:
            raise ValueError("Plain employees cannot have a password — they don't log in")


employee_service = EmployeeService()
