import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    vehicle_id: str  # MongoDB ObjectId
    wash_type_id: uuid.UUID
    employee_id: uuid.UUID
    amount: float
    transaction_date: datetime
    notes: Optional[str] = None
