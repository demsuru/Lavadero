import uuid
from datetime import datetime
from sqlalchemy import Float, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin


class Transaction(Base, UUIDMixin):
    __tablename__ = "transactions"

    vehicle_id: Mapped[str] = mapped_column(String(24), nullable=False)  # MongoDB ObjectId
    wash_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("wash_types.id"), nullable=False
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    transaction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)

    wash_type: Mapped["WashType"] = relationship("WashType", back_populates="transactions")
    employee: Mapped["Employee"] = relationship("Employee", back_populates="transactions")
