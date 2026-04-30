from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.services.vehicle_service import vehicle_service
from app.services.transaction_service import transaction_service


class DashboardService:
    async def get_today_stats(
        self, db: AsyncSession, mongo_db: AsyncIOMotorDatabase, target_date: date | None = None
    ) -> dict:
        """Get dashboard statistics for today (or specified date)."""
        try:
            if target_date is None:
                target_date = datetime.now().date()

            completed_vehicles = await vehicle_service.get_completed_today(mongo_db, target_date)
            revenue_today = await transaction_service.get_today_revenue(db, target_date)

            return {
                "completed_count": len(completed_vehicles),
                "revenue_today": revenue_today,
            }
        except Exception as e:
            raise RuntimeError(f"Error fetching dashboard stats: {e}")


dashboard_service = DashboardService()
