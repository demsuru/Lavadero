from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class VehicleCreate(BaseModel):
    plate: str
    brand: str
    customer_name: str
    customer_phone: Optional[str] = None
    assigned_employee_id: str  # UUID from PostgreSQL, stored as string in MongoDB
    wash_type_id: str           # UUID from PostgreSQL, stored as string in MongoDB
    notes: Optional[str] = None


class VehicleRead(BaseModel):
    id: str  # MongoDB ObjectId as string
    plate: str
    brand: str
    customer_name: str
    customer_phone: Optional[str] = None
    assigned_employee_id: str
    wash_type_id: str
    entry_timestamp: datetime
    exit_timestamp: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime


class VehicleExitRead(BaseModel):
    vehicle: VehicleRead
    transaction_id: str
