import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.wash_type import WashType
from app.schemas.wash_type import WashTypeCreate, WashTypeUpdate
from app.repositories.wash_type_repository import wash_type_repository


class WashTypeService:
    def __init__(self):
        self.repository = wash_type_repository

    async def create_wash_type(self, db: AsyncSession, data: WashTypeCreate) -> WashType:
        try:
            existing = await self.repository.get_by_name(db, data.name)
            if existing:
                raise ValueError("Wash type name already exists")
            return await self.repository.create(db, data)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error creating wash type: {e}")

    async def get_wash_type(self, db: AsyncSession, wash_type_id: uuid.UUID) -> WashType:
        try:
            wash_type = await self.repository.get(db, wash_type_id)
            if not wash_type:
                raise ValueError("Wash type not found")
            return wash_type
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error fetching wash type: {e}")

    async def list_wash_types(self, db: AsyncSession, only_active: bool = False) -> list[WashType]:
        try:
            if only_active:
                return await self.repository.get_all_active(db)
            return await self.repository.get_multi(db)
        except Exception as e:
            raise RuntimeError(f"Error listing wash types: {e}")

    async def update_wash_type(self, db: AsyncSession, wash_type_id: uuid.UUID, data: WashTypeUpdate) -> WashType:
        try:
            wash_type = await self.repository.get(db, wash_type_id)
            if not wash_type:
                raise ValueError("Wash type not found")
            if data.name and data.name != wash_type.name:
                existing = await self.repository.get_by_name(db, data.name)
                if existing:
                    raise ValueError("Wash type name already exists")
            return await self.repository.update(db, wash_type, data)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error updating wash type: {e}")

    async def deactivate_wash_type(self, db: AsyncSession, wash_type_id: uuid.UUID) -> WashType:
        try:
            wash_type = await self.repository.get(db, wash_type_id)
            if not wash_type:
                raise ValueError("Wash type not found")
            return await self.repository.deactivate(db, wash_type)
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error deactivating wash type: {e}")


wash_type_service = WashTypeService()
