import enum
from sqlalchemy import String, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class EmployeeRole(str, enum.Enum):
    employee = "employee"
    manager = "manager"
    admin = "admin"
    superadmin = "superadmin"


class EmployeeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


# Roles allowed to log in and operate the system
LOGIN_ROLES = {EmployeeRole.manager, EmployeeRole.admin, EmployeeRole.superadmin}
ADMIN_ROLES = {EmployeeRole.admin, EmployeeRole.superadmin}


class Employee(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "employees"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    role: Mapped[EmployeeRole] = mapped_column(
        SAEnum(EmployeeRole), nullable=False, default=EmployeeRole.employee
    )
    status: Mapped[EmployeeStatus] = mapped_column(
        SAEnum(EmployeeStatus), nullable=False, default=EmployeeStatus.active
    )
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)

    shifts: Mapped[list["Shift"]] = relationship("Shift", back_populates="employee")
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="employee")

    @property
    def can_login(self) -> bool:
        return self.role in LOGIN_ROLES and self.password_hash is not None
