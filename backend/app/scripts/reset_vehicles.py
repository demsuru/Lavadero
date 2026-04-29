"""Reset vehicles collection and create a test vehicle."""
import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from app.core.config import get_settings
from app.models.employee import Employee, EmployeeStatus
from app.models.wash_type import WashType, WashTypeStatus

settings = get_settings()


async def reset_vehicles():
    """Delete all vehicles and create a test one."""
    # Connect to MongoDB
    mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongo_db = mongo_client[settings.MONGODB_DB_NAME]
    vehicles_col = mongo_db['vehicles']

    # Delete all vehicles
    result = await vehicles_col.delete_many({})
    print(f"[OK] Deleted {result.deleted_count} vehicles")

    # Connect to PostgreSQL to get real IDs
    engine = create_async_engine(settings.DATABASE_URL)
    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as session:
        # Get first active employee
        result = await session.execute(
            select(Employee).where(Employee.status == EmployeeStatus.active).limit(1)
        )
        employee = result.scalars().first()

        if not employee:
            print("[ERROR] No active employees found. Create an employee first.")
            return

        # Get first active wash type
        result = await session.execute(
            select(WashType).where(WashType.status == WashTypeStatus.active).limit(1)
        )
        wash_type = result.scalars().first()

        if not wash_type:
            print("[ERROR] No active wash types found. Create a wash type first.")
            return

        print(f"Using employee: {employee.name} ({employee.id})")
        print(f"Using wash type: {wash_type.name} ({wash_type.id})")

        # Create a test vehicle
        now = datetime.now(timezone.utc)
        test_vehicle = {
            'plate': 'ABC123',
            'brand': 'Toyota',
            'customer_name': 'Juan Pérez',
            'customer_phone': '+54 9 11 1234-5678',
            'assigned_employee_id': str(employee.id),
            'wash_type_id': str(wash_type.id),
            'entry_timestamp': now,
            'exit_timestamp': None,
            'status': 'in_progress',
            'notes': 'Test vehicle - created fresh',
            'created_at': now,
        }

        result = await vehicles_col.insert_one(test_vehicle)
        print(f"[OK] Created test vehicle with ID: {result.inserted_id}")

    await engine.dispose()
    mongo_client.close()


if __name__ == '__main__':
    asyncio.run(reset_vehicles())
