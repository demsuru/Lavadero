import enum
import uuid
from datetime import time
from sqlalchemy import Time, Enum as SAEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class DayOfWeek(str, enum.Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"


class Shift(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "shifts"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False
    )
    day_of_week: Mapped[DayOfWeek] = mapped_column(SAEnum(DayOfWeek), nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="shifts")
