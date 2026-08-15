from typing import Optional

from fastapi import APIRouter, Query

from backend.app.services.data_service import get_campaigns

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("")
def list_campaigns(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
):
    return get_campaigns(creator=creator, campaign=campaign, date_from=date_from, date_to=date_to)
