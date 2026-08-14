from pydantic import BaseModel


class ReferralSourceSummary(BaseModel):
    traffic_source: str
    traffic_volume: int
    clicks: int
    conversion_rate: float
    purchase_volume: int
    revenue: float
