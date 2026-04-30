import uuid
from datetime import date, time
from sqlalchemy import Time, ForeignKey, Date, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Shift(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "shifts"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True
    )
    shift_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="shifts")

    __table_args__ = (
        Index("ix_shifts_employee_date", "employee_id", "shift_date"),
    )
