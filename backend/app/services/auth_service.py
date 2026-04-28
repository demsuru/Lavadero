from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import create_access_token, verify_password
from app.models.employee import Employee, EmployeeStatus, LOGIN_ROLES
from app.repositories.employee_repository import employee_repository
from app.schemas.auth import AuthenticatedUser, TokenResponse

settings = get_settings()


class AuthService:
    """Authenticates managers/admins/superadmins and issues JWT access tokens."""

    def __init__(self):
        self.repository = employee_repository

    async def login(self, db: AsyncSession, email: str, password: str) -> TokenResponse:
        try:
            employee = await self.repository.get_by_email(db, email)

            # Generic message — never reveal whether email exists or password is wrong
            if not self._is_valid_login(employee, password):
                raise ValueError("Invalid email or password")

            assert employee is not None  # narrowed by _is_valid_login

            token = create_access_token(subject=str(employee.id), role=employee.role.value)
            user = AuthenticatedUser(
                id=employee.id,
                name=employee.name,
                email=employee.email or "",
                role=employee.role,
            )
            return TokenResponse(
                access_token=token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                user=user,
            )
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error during login: {e}")

    @staticmethod
    def _is_valid_login(employee: Employee | None, password: str) -> bool:
        if employee is None:
            return False
        if employee.status != EmployeeStatus.active:
            return False
        if employee.role not in LOGIN_ROLES:
            return False
        if not employee.password_hash:
            return False
        return verify_password(password, employee.password_hash)


auth_service = AuthService()
