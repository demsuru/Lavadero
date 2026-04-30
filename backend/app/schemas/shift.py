import uuid
from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, model_validator


class ShiftCreate(BaseModel):
    employee_id: uuid.UUID
    shift_date: date
    start_time: time
    end_time: time

    @model_validator(mode="after")
    def validate_times(self) -> "ShiftCreate":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class ShiftUpdate(BaseModel):
    shift_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class ShiftRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    employee_id: uuid.UUID
    shift_date: date
    start_time: time
    end_time: time
    created_at: datetime
    updated_at: datetime
