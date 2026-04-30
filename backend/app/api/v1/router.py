from fastapi import APIRouter
from app.api.v1.endpoints import auth, employees, shifts, wash_types, vehicles, transactions, dashboard, reports, invoices

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(shifts.router, prefix="/shifts", tags=["shifts"])
api_router.include_router(wash_types.router, prefix="/wash-types", tags=["wash-types"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["invoices"])
