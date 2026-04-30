"""Reset database to match current models."""
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import get_settings
from app.core.security import hash_password
from app.models.base import Base
from app.models.employee import Employee, EmployeeRole, EmployeeStatus
import app.models  # Register all models

settings = get_settings()

async def reset_db():
    """Drop all tables and recreate them."""
    engine = create_async_engine(settings.DATABASE_URL, echo=False)

    # Drop all tables
    async with engine.begin() as conn:
        print("[1/3] Dropping all tables...")
        await conn.execute(text("DROP TABLE IF EXISTS transactions CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS shifts CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS employees CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS wash_types CASCADE"))
        await conn.commit()
        print("[1/3] [OK] Tables dropped")

    # Recreate all tables
    async with engine.begin() as conn:
        print("[2/3] Recreating tables from models...")
        await conn.run_sync(Base.metadata.create_all)
        await conn.commit()
        print("[2/3] [OK] Tables created")

    # Create initial admin
    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_maker() as db:
        print("[3/3] Creating initial admin...")
        admin = Employee(
            name="Admin",
            email="admin@lavadero.com",
            password_hash=hash_password("admin123"),
            role=EmployeeRole.superadmin,
            status=EmployeeStatus.active
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        print(f"[3/3] [OK] Admin created: {admin.email}")

    await engine.dispose()
    print("\n[OK] Database reset complete!")
    print(f"  Email: admin@lavadero.com")
    print(f"  Password: admin123")

if __name__ == '__main__':
    asyncio.run(reset_db())
