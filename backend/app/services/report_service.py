from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.transaction_repository import transaction_repository
from app.repositories.vehicle_repository import vehicle_repository
from app.repositories.employee_repository import employee_repository


class ReportService:
    async def get_period_summary(self, db: AsyncSession, mongo_db: AsyncIOMotorDatabase, start_date: date, end_date: date) -> dict:
        """Get summary statistics for a period."""
        try:
            transactions = await transaction_repository.get_by_date_range(db, start_date, end_date)
            total_revenue = sum(t.amount for t in transactions)

            vehicles = await vehicle_repository.search(mongo_db, date_from=start_date, date_to=end_date)
            total_vehicles = len(vehicles)

            avg_per_vehicle = total_revenue / total_vehicles if total_vehicles > 0 else 0.0

            return {
                "total_revenue": total_revenue,
                "total_vehicles": total_vehicles,
                "avg_per_vehicle": avg_per_vehicle,
                "start_date": start_date,
                "end_date": end_date,
            }
        except Exception as e:
            raise RuntimeError(f"Error fetching period summary: {e}")

    async def get_daily_revenue_chart(self, db: AsyncSession, start_date: date, end_date: date) -> list[dict]:
        """Get daily revenue grouped by date, filling missing days with 0."""
        try:
            daily_data = await transaction_repository.get_daily_revenue(db, start_date, end_date)

            result = {}
            for item in daily_data:
                result[str(item["day"])] = item

            filled_result = []
            current_date = start_date
            while current_date <= end_date:
                date_str = str(current_date)
                if date_str in result:
                    filled_result.append({
                        "day": current_date,
                        "revenue": result[date_str]["revenue"],
                        "count": result[date_str]["count"],
                    })
                else:
                    filled_result.append({
                        "day": current_date,
                        "revenue": 0.0,
                        "count": 0,
                    })
                current_date += timedelta(days=1)

            return filled_result
        except Exception as e:
            raise RuntimeError(f"Error fetching daily revenue chart: {e}")

    async def get_employee_stats(self, db: AsyncSession, start_date: date, end_date: date) -> list[dict]:
        """Get vehicle wash statistics per employee."""
        try:
            stats = await transaction_repository.get_stats_by_employee(db, start_date, end_date)

            result = []
            for item in stats:
                employee = await employee_repository.get(db, item["employee_id"])
                result.append({
                    "employee_id": str(item["employee_id"]),
                    "employee_name": employee.name if employee else "Unknown",
                    "total_cars": item["total_cars"],
                    "total_revenue": item["total_revenue"],
                })

            return result
        except Exception as e:
            raise RuntimeError(f"Error fetching employee stats: {e}")

    async def search_vehicles(
        self, mongo_db: AsyncIOMotorDatabase, plate: str | None = None,
        date_from: date | None = None, date_to: date | None = None
    ) -> list[dict]:
        """Search vehicles by plate or date range."""
        try:
            return await vehicle_repository.search(mongo_db, plate=plate, date_from=date_from, date_to=date_to)
        except Exception as e:
            raise RuntimeError(f"Error searching vehicles: {e}")


report_service = ReportService()
