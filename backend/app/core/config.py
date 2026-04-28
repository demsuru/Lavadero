from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "car_wash_nosql"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # JWT / Auth
    SECRET_KEY: str = "changeme-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    # Initial admin bootstrap (only used if no superadmin/admin exists yet)
    INITIAL_ADMIN_EMAIL: str | None = None
    INITIAL_ADMIN_PASSWORD: str | None = None
    INITIAL_ADMIN_NAME: str = "Administrator"

    model_config = {"env_file": ".env"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
