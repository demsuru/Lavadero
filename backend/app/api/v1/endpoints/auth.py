from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user
from app.models.employee import Employee
from app.schemas.auth import AuthenticatedUser, LoginRequest, TokenResponse
from app.services.auth_service import auth_service

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await auth_service.login(db, data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=AuthenticatedUser)
async def get_me(current_user: Employee = Depends(get_current_user)):
    """Return the currently authenticated user — used by the frontend on app load."""
    return AuthenticatedUser(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email or "",
        role=current_user.role,
    )
