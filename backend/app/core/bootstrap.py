"""First-run bootstrap: creates an initial superadmin if none exists.

Triggered on app startup. Reads INITIAL_ADMIN_EMAIL/PASSWORD from settings.
No-op if any admin/superadmin already exists or env vars are missing.
"""
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.employee import Employee, EmployeeRole, EmployeeStatus, ADMIN_ROLES

log = logging.getLogger("uvicorn.error")


async def ensure_initial_admin(session_factory: async_sessionmaker[AsyncSession]) -> None:
    settings = get_settings()

    if not settings.INITIAL_ADMIN_EMAIL or not settings.INITIAL_ADMIN_PASSWORD:
        return

    async with session_factory() as db:
        result = await db.execute(
            select(Employee).where(Employee.role.in_(list(ADMIN_ROLES)))
        )
        if result.scalars().first() is not None:
            return  # An admin already exists — skip bootstrap

        existing = await db.execute(
            select(Employee).where(Employee.email == settings.INITIAL_ADMIN_EMAIL)
        )
        if existing.scalars().first() is not None:
            log.warning(
                "Bootstrap skipped: %s already exists with a non-admin role",
                settings.INITIAL_ADMIN_EMAIL,
            )
            return

        admin = Employee(
            name=settings.INITIAL_ADMIN_NAME,
            email=settings.INITIAL_ADMIN_EMAIL,
            role=EmployeeRole.superadmin,
            status=EmployeeStatus.active,
            password_hash=hash_password(settings.INITIAL_ADMIN_PASSWORD),
        )
        db.add(admin)
        await db.commit()
        log.info("Initial superadmin created: %s", settings.INITIAL_ADMIN_EMAIL)
