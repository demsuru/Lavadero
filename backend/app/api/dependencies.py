import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.database import get_db as _get_db
from app.core.mongodb import get_mongo_db as _get_mongo_db
from app.core.security import decode_access_token
from app.models.employee import Employee, EmployeeRole, EmployeeStatus, LOGIN_ROLES, ADMIN_ROLES
from app.repositories.employee_repository import employee_repository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=True)


async def get_db() -> AsyncSession:
    async for session in _get_db():
        yield session


def get_mongo_db() -> AsyncIOMotorDatabase:
    return _get_mongo_db()


# ── Authentication ───────────────────────────────────────────────

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> Employee:
    """Decode the JWT, load the employee, ensure they're still allowed in."""
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise CREDENTIALS_EXCEPTION
    except JWTError:
        raise CREDENTIALS_EXCEPTION

    try:
        employee = await employee_repository.get(db, uuid.UUID(user_id))
    except (ValueError, TypeError):
        raise CREDENTIALS_EXCEPTION

    if not employee:
        raise CREDENTIALS_EXCEPTION
    if employee.status != EmployeeStatus.active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    if employee.role not in LOGIN_ROLES:
        raise HTTPException(status_code=403, detail="User role cannot operate the system")

    return employee


# ── Authorization ───────────────────────────────────────────────


def require_roles(*allowed: EmployeeRole):
    """Dependency factory: only allow users whose role is in `allowed`."""

    async def _checker(current_user: Employee = Depends(get_current_user)) -> Employee:
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this action",
            )
        return current_user

    return _checker


require_authenticated = get_current_user
require_manager_or_above = require_roles(*LOGIN_ROLES)
require_admin_or_above = require_roles(*ADMIN_ROLES)
