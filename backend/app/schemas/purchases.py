from pydantic import BaseModel


class PurchaseSummary(BaseModel):
    transaction_id: str
    customer_id: str
    creator_id: str
    purchase_timestamp: str
    order_value: float
    traffic_source: str
