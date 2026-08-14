import pandas as pd

from pipeline.validate import validate_dataframe


def test_validate_dataframe_accepts_clean_data():
    df = pd.DataFrame(
        [
            {
                "campaign_id": "CAMP-001",
                "creator_id": "CR-1",
                "creator_name": "Ava Brooks",
                "campaign_date": "2026-01-15",
                "impressions": 1200,
                "likes": 180,
                "comments": 40,
                "shares": 20,
                "referral_id": "REF-001",
                "traffic_source": "Instagram",
                "click_timestamp": "2026-01-16 09:00:00",
                "customer_id": "CUST-100",
                "transaction_id": "TXN-100",
                "purchase_timestamp": "2026-01-17 10:30:00",
                "order_value": 84.5,
            }
        ]
    )

    result = validate_dataframe(df)

    assert result["errors"] == []
    assert result["warnings"] == []


def test_validate_dataframe_rejects_invalid_values():
    df = pd.DataFrame(
        [
            {
                "campaign_id": "CAMP-002",
                "creator_id": "CR-2",
                "creator_name": "Noah Lee",
                "campaign_date": "invalid-date",
                "impressions": -10,
                "likes": 20,
                "comments": 5,
                "shares": 3,
                "referral_id": "REF-002",
                "traffic_source": "TikTok",
                "click_timestamp": "2026-01-20 11:00:00",
                "customer_id": "CUST-200",
                "transaction_id": "TXN-200",
                "purchase_timestamp": "2026-01-21 12:10:00",
                "order_value": -12.5,
            }
        ]
    )

    result = validate_dataframe(df)

    assert len(result["errors"]) > 0
