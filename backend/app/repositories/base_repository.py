import uuid
from typing import Generic, TypeVar, Type, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[ModelType]:
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, obj_in: CreateSchemaType) -> ModelType:
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: ModelType, obj_in: UpdateSchemaType) -> ModelType:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id: uuid.UUID) -> bool:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            return True
        return False
