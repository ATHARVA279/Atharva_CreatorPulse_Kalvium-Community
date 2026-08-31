from typing import Optional
from fastapi import APIRouter, Query

from backend.app.services.data_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
    traffic_source: Optional[str] = Query(default=None),
    product_category: Optional[str] = Query(default=None),
):
    return get_dashboard_summary(
        creator=creator,
        campaign=campaign,
        date_from=date_from,
        date_to=date_to,
        traffic_source=traffic_source,
        product_category=product_category,
    )
