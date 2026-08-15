from fastapi import APIRouter

from backend.app.services.data_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary():
    return get_dashboard_summary()
