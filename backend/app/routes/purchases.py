from typing import Optional
from fastapi import APIRouter, Query

from backend.app.services.data_service import get_purchase_behaviour, get_funnel, get_revenue

router = APIRouter(tags=["purchases"])


@router.get("/funnel")
def funnel(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
    traffic_source: Optional[str] = Query(default=None),
    product_category: Optional[str] = Query(default=None),
):
    return get_funnel(
        creator=creator,
        campaign=campaign,
        date_from=date_from,
        date_to=date_to,
        traffic_source=traffic_source,
        product_category=product_category,
    )


@router.get("/revenue")
def revenue(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
    traffic_source: Optional[str] = Query(default=None),
    product_category: Optional[str] = Query(default=None),
):
    return get_revenue(
        creator=creator,
        campaign=campaign,
        date_from=date_from,
        date_to=date_to,
        traffic_source=traffic_source,
        product_category=product_category,
    )


@router.get("/purchase-behaviour")
def purchase_behaviour(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
    traffic_source: Optional[str] = Query(default=None),
    product_category: Optional[str] = Query(default=None),
):
    return get_purchase_behaviour(
        creator=creator,
        campaign=campaign,
        date_from=date_from,
        date_to=date_to,
        traffic_source=traffic_source,
        product_category=product_category,
    )
