from typing import Optional

from fastapi import APIRouter, Query

from backend.app.services.data_service import get_referral_sources

router = APIRouter(prefix="/referral-sources", tags=["referrals"])


@router.get("")
def referral_sources(
    creator: Optional[str] = Query(default=None),
    campaign: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
):
    return get_referral_sources(creator=creator, campaign=campaign, date_from=date_from, date_to=date_to)
