from typing import Optional

from pydantic import BaseModel


class CreatorSummary(BaseModel):
    creator_id: str
    creator_name: str
    engagement_rate: float
    ctr: float
    conversion_rate: float
    revenue: float
    revenue_per_click: float
    purchase_value: float
    creator_score: float


class CreatorDetail(BaseModel):
    creator_id: str
    creator_name: str
    total_campaigns: int
    total_impressions: int
    total_engagements: int
    total_clicks: int
    total_purchases: int
    total_revenue: float
    engagement_rate: float
    ctr: float
    conversion_rate: float
    revenue_per_click: float
    purchase_value: float
    creator_score: float
