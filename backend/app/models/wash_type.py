import enum
from sqlalchemy import String, Float, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class WashTypeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class WashType(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "wash_types"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[WashTypeStatus] = mapped_column(
        SAEnum(WashTypeStatus), nullable=False, default=WashTypeStatus.active
    )

    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="wash_type")
