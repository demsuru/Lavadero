from datetime import date, datetime
from pydantic import BaseModel


class PeriodSummary(BaseModel):
    total_revenue: float
    total_vehicles: int
    avg_per_vehicle: float
    start_date: date
    end_date: date


class DailyRevenue(BaseModel):
    day: date
    revenue: float
    count: int


class EmployeeStats(BaseModel):
    employee_id: str
    employee_name: str
    total_cars: int
    total_revenue: float


class VehicleSearchResult(BaseModel):
    id: str
    plate: str
    brand: str
    customer_name: str
    customer_phone: str | None
    entry_timestamp: datetime
    exit_timestamp: datetime | None
    status: str
    wash_type_id: str
