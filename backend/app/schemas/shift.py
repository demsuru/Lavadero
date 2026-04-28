import uuid
from datetime import time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, model_validator
from app.models.shift import DayOfWeek


class ShiftCreate(BaseModel):
    employee_id: uuid.UUID
    day_of_week: DayOfWeek
    start_time: time
    end_time: time

    @model_validator(mode="after")
    def validate_times(self) -> "ShiftCreate":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class ShiftUpdate(BaseModel):
    day_of_week: Optional[DayOfWeek] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class ShiftRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    employee_id: uuid.UUID
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    created_at: datetime
    updated_at: datetime
