from pydantic import BaseModel


class CampaignSummary(BaseModel):
    campaign_id: str
    creator_id: str
    creator_name: str
    campaign_date: str
    impressions: int
    engagements: int
    clicks: int
    purchases: int
    revenue: float
    engagement_rate: float
    ctr: float
    conversion_rate: float
    revenue_per_click: float
    purchase_value: float
