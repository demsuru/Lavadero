import uuid
from pydantic import BaseModel, EmailStr
from app.models.employee import EmployeeRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: "AuthenticatedUser"


class AuthenticatedUser(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: EmployeeRole


TokenResponse.model_rebuild()
