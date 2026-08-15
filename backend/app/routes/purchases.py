from typing import Optional

from fastapi import APIRouter, Query

from backend.app.services.data_service import get_purchase_behaviour, get_funnel, get_revenue

router = APIRouter(tags=["purchases"])


@router.get("/funnel")
def funnel():
    return get_funnel()


@router.get("/revenue")
def revenue(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
):
    return get_revenue(creator=creator, campaign=campaign)


@router.get("/purchase-behaviour")
def purchase_behaviour(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
):
    return get_purchase_behaviour(creator=creator, campaign=campaign)
