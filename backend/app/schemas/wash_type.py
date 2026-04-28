import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator
from app.models.wash_type import WashTypeStatus


class WashTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("price must be greater than 0")
        return v


class WashTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    status: Optional[WashTypeStatus] = None

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v: float | None) -> float | None:
        if v is not None and v <= 0:
            raise ValueError("price must be greater than 0")
        return v


class WashTypeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: float
    status: WashTypeStatus
    created_at: datetime
    updated_at: datetime
