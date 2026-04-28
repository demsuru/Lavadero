"""CLI to create an admin/superadmin user.

Usage:
    python -m app.scripts.create_admin

Prompts for name, email, password (twice), and role. Refuses to create a user
with a role outside of admin/superadmin.
"""
import asyncio
import getpass
import sys

from sqlalchemy import select

from app.core.database import AsyncSessionLocal, ensure_database_exists, engine
from app.core.security import hash_password
from app.models.base import Base
from app.models.employee import Employee, EmployeeRole, EmployeeStatus
import app.models  # noqa: F401


VALID_ROLES = {"admin", "superadmin"}


async def main() -> int:
    print("─── Create admin user ───")
    name = input("Name: ").strip()
    email = input("Email: ").strip().lower()
    role_input = (input("Role [admin/superadmin] (default: admin): ").strip().lower() or "admin")

    if role_input not in VALID_ROLES:
        print(f"✗ Invalid role. Must be one of: {', '.join(VALID_ROLES)}")
        return 1
    if not name or not email:
        print("✗ Name and email are required")
        return 1

    password = getpass.getpass("Password (min 8 chars): ")
    if len(password) < 8:
        print("✗ Password must be at least 8 characters")
        return 1
    if password != getpass.getpass("Confirm password: "):
        print("✗ Passwords don't match")
        return 1

    await ensure_database_exists()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Employee).where(Employee.email == email))
        if result.scalars().first():
            print(f"✗ Email {email} already registered")
            return 1

        admin = Employee(
            name=name,
            email=email,
            role=EmployeeRole(role_input),
            status=EmployeeStatus.active,
            password_hash=hash_password(password),
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        print(f"✓ {role_input.capitalize()} created: {admin.email} (id={admin.id})")
        return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
