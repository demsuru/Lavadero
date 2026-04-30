"""Fix admin user by recreating with valid password hash."""
import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import get_settings
from app.core.security import hash_password
from app.models.employee import Employee, EmployeeRole, EmployeeStatus

settings = get_settings()

async def fix_admin():
    """Delete and recreate admin with fresh password hash."""
    engine = create_async_engine(settings.DATABASE_URL)
    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as db:
        # Delete existing admin
        result = await db.execute(
            select(Employee).where(Employee.email == "admin@lavadero.com")
        )
        existing = result.scalar_one_or_none()
        if existing:
            await db.delete(existing)
            await db.commit()
            print(f"[OK] Deleted existing admin")

        # Create new admin
        password = "admin123"
        hashed = hash_password(password)
        print(f"[INFO] New hash length: {len(hashed)} chars")

        admin = Employee(
            name="Admin",
            email="admin@lavadero.com",
            password_hash=hashed,
            role=EmployeeRole.superadmin,
            status=EmployeeStatus.active
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        print(f"[OK] Admin recreated: {admin.email}")
        print(f"[OK] ID: {admin.id}")
        print(f"[OK] Role: {admin.role}")
        print(f"[OK] Status: {admin.status}")

    await engine.dispose()

if __name__ == '__main__':
    asyncio.run(fix_admin())
