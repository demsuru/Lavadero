from datetime import datetime, timezone, date
from typing import Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to API-friendly dict."""
    doc["id"] = str(doc.pop("_id"))
    return doc


class VehicleRepository:
    def __init__(self, collection_name: str = "vehicles"):
        self.collection_name = collection_name

    def _col(self, db: AsyncIOMotorDatabase):
        return db[self.collection_name]

    async def get(self, db: AsyncIOMotorDatabase, vehicle_id: str) -> Optional[dict]:
        doc = await self._col(db).find_one({"_id": ObjectId(vehicle_id)})
        return _serialize(doc) if doc else None

    async def get_multi(
        self,
        db: AsyncIOMotorDatabase,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[dict]:
        query = {"status": status} if status else {}
        cursor = self._col(db).find(query).skip(skip).limit(limit)
        return [_serialize(doc) async for doc in cursor]

    async def get_in_progress(self, db: AsyncIOMotorDatabase) -> list[dict]:
        cursor = self._col(db).find({"status": "in_progress"})
        return [_serialize(doc) async for doc in cursor]

    async def get_by_plate(self, db: AsyncIOMotorDatabase, plate: str) -> list[dict]:
        cursor = self._col(db).find({"plate": plate.upper()})
        return [_serialize(doc) async for doc in cursor]

    async def create(self, db: AsyncIOMotorDatabase, vehicle_data: dict) -> dict:
        now = datetime.now(timezone.utc)
        document = {
            **vehicle_data,
            "plate": vehicle_data["plate"].upper(),
            "entry_timestamp": now,
            "exit_timestamp": None,
            "status": "in_progress",
            "created_at": now,
        }
        result = await self._col(db).insert_one(document)
        return await self.get(db, str(result.inserted_id))

    async def register_exit(self, db: AsyncIOMotorDatabase, vehicle_id: str) -> Optional[dict]:
        now = datetime.now(timezone.utc)
        result = await self._col(db).find_one_and_update(
            {"_id": ObjectId(vehicle_id), "status": "in_progress"},
            {"$set": {"exit_timestamp": now, "status": "completed"}},
            return_document=True,
        )
        return _serialize(result) if result else None

    async def update(self, db: AsyncIOMotorDatabase, vehicle_id: str, updates: dict) -> Optional[dict]:
        result = await self._col(db).find_one_and_update(
            {"_id": ObjectId(vehicle_id), "status": "in_progress"},
            {"$set": updates},
            return_document=True,
        )
        return _serialize(result) if result else None

    async def get_completed_today(self, db: AsyncIOMotorDatabase, target_date: date) -> list[dict]:
        """Get all completed vehicles for a specific date."""
        start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, datetime.max.time()).replace(tzinfo=timezone.utc)

        cursor = self._col(db).find({
            "status": "completed",
            "exit_timestamp": {"$gte": start_of_day, "$lte": end_of_day}
        })
        return [_serialize(doc) async for doc in cursor]

    async def search(self, db: AsyncIOMotorDatabase, plate: Optional[str] = None, date_from: Optional[date] = None, date_to: Optional[date] = None) -> list[dict]:
        """Search vehicles by plate or date range."""
        query = {}

        if plate:
            query["plate"] = {"$regex": plate.upper(), "$options": "i"}

        if date_from and date_to:
            start_of_day = datetime.combine(date_from, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = datetime.combine(date_to, datetime.max.time()).replace(tzinfo=timezone.utc)
            query["entry_timestamp"] = {"$gte": start_of_day, "$lte": end_of_day}

        cursor = self._col(db).find(query) if query else self._col(db).find({})
        return [_serialize(doc) async for doc in cursor]


vehicle_repository = VehicleRepository()
