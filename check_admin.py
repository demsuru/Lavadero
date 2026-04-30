"""Check if admin exists in database."""
import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.employee import Employee

async def check():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Employee).where(Employee.email == "admin@lavadero.com")
        )
        admin = result.scalar_one_or_none()
        if admin:
            print(f"Admin found:")
            print(f"  Email: {admin.email}")
            print(f"  Name: {admin.name}")
            print(f"  Role: {admin.role}")
            print(f"  Status: {admin.status}")
            print(f"  Has password hash: {bool(admin.password_hash)}")
            if admin.password_hash:
                print(f"  Hash length: {len(admin.password_hash)}")
        else:
            print("Admin NOT found in database")

asyncio.run(check())
