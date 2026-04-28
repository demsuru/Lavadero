import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from app.models.employee import EmployeeRole, EmployeeStatus


class EmployeeCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: EmployeeRole = EmployeeRole.employee
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[EmployeeRole] = None
    status: Optional[EmployeeStatus] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)


class EmployeeRead(BaseModel):
    """Public employee data — never includes password_hash."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: EmployeeRole
    status: EmployeeStatus
    created_at: datetime
    updated_at: datetime
