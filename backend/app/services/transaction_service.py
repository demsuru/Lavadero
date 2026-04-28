import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.transaction import Transaction
from app.repositories.transaction_repository import transaction_repository


class TransactionService:
    def __init__(self):
        self.repository = transaction_repository

    async def get_transaction(self, db: AsyncSession, transaction_id: uuid.UUID) -> Transaction:
        try:
            transaction = await self.repository.get(db, transaction_id)
            if not transaction:
                raise ValueError("Transaction not found")
            return transaction
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Error fetching transaction: {e}")

    async def list_transactions(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Transaction]:
        try:
            return await self.repository.get_multi(db, skip=skip, limit=limit)
        except Exception as e:
            raise RuntimeError(f"Error listing transactions: {e}")

    async def get_by_date(self, db: AsyncSession, target_date: date) -> list[Transaction]:
        try:
            return await self.repository.get_by_date(db, target_date)
        except Exception as e:
            raise RuntimeError(f"Error fetching transactions by date: {e}")


transaction_service = TransactionService()
