from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_campaigns: int
    total_creators: int
    total_impressions: int
    total_engagements: int
    total_referral_clicks: int
    total_purchases: int
    overall_conversion_rate: float
    total_attributed_revenue: float
