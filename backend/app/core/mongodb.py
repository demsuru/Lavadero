from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient | None = None


async def connect():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)


async def disconnect():
    global client
    if client:
        client.close()


def get_mongo_db() -> AsyncIOMotorDatabase:
    return client[settings.MONGODB_DB_NAME]
