from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.dashboard import router as dashboard_router
from backend.app.routes.creators import router as creators_router
from backend.app.routes.campaigns import router as campaigns_router
from backend.app.routes.referrals import router as referrals_router
from backend.app.routes.purchases import router as purchases_router

app = FastAPI(title="CreatorPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router, prefix="/api")
app.include_router(creators_router, prefix="/api")
app.include_router(campaigns_router, prefix="/api")
app.include_router(referrals_router, prefix="/api")
app.include_router(purchases_router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}
