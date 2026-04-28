from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.wash_type import WashType, WashTypeStatus
from app.schemas.wash_type import WashTypeCreate, WashTypeUpdate
from app.repositories.base_repository import BaseRepository


class WashTypeRepository(BaseRepository[WashType, WashTypeCreate, WashTypeUpdate]):
    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[WashType]:
        result = await db.execute(select(WashType).where(WashType.name == name))
        return result.scalars().first()

    async def get_all_active(self, db: AsyncSession) -> list[WashType]:
        result = await db.execute(
            select(WashType).where(WashType.status == WashTypeStatus.active)
        )
        return list(result.scalars().all())

    async def deactivate(self, db: AsyncSession, wash_type: WashType) -> WashType:
        wash_type.status = WashTypeStatus.inactive
        await db.flush()
        await db.refresh(wash_type)
        return wash_type


wash_type_repository = WashTypeRepository(WashType)
