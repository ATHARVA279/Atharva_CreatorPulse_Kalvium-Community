from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import test_connection
from backend.app.routes.auth import router as auth_router
from backend.app.routes.dashboard import router as dashboard_router
from backend.app.routes.creators import router as creators_router
from backend.app.routes.campaigns import router as campaigns_router
from backend.app.routes.referrals import router as referrals_router
from backend.app.routes.purchases import router as purchases_router
from backend.app.services.auth_service import ensure_users_table


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    ok = test_connection()
    if ok:
        print("[DB] ✅ Connected to Supabase PostgreSQL successfully.")
        try:
            ensure_users_table()
            print("[DB] ✅ Users table ready.")
        except Exception as exc:
            print(f"[DB] ⚠️  Could not ensure users table: {exc}")
    else:
        print("[DB] ❌ Could not connect to the database. Check DATABASE_URL in .env")
    yield
    # Shutdown (nothing to clean up for now)


app = FastAPI(title="CreatorPulse API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(creators_router, prefix="/api")
app.include_router(campaigns_router, prefix="/api")
app.include_router(referrals_router, prefix="/api")
app.include_router(purchases_router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}
