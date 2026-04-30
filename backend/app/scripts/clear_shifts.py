#!/usr/bin/env python
"""Clear all shifts from the database."""

import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import Settings


async def clear_shifts():
    settings = Settings()
    engine = create_async_engine(str(settings.DATABASE_URL), echo=False)

    async with engine.begin() as conn:
        await conn.execute(text("TRUNCATE TABLE shifts CASCADE"))
        print("✅ Shifts table cleared successfully")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(clear_shifts())
