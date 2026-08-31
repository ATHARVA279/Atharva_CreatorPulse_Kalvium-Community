from __future__ import annotations

from pathlib import Path
from typing import Dict

import pandas as pd

from pipeline.validate import fail_on_critical_errors, validate_dataframe

RAW_DATA_DIRECTORY = Path(__file__).resolve().parent.parent / "data" / "raw"
PROCESSED_DIRECTORY = Path(__file__).resolve().parent.parent / "data" / "processed"


def discover_dataset(raw_dir: Path = RAW_DATA_DIRECTORY) -> Path:
    csv_files = sorted(raw_dir.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {raw_dir}")
    return csv_files[0]


FIELD_ALIASES = {
    "campaign_id": ["campaign_id", "campaignid", "campaign id", "campaign"],
    "creator_id": ["creator_id", "creatorid", "influencer_id", "influencerid", "creator id"],
    "creator_name": ["creator_name", "creator", "influencer_name", "creator name", "name"],
    "campaign_date": ["campaign_date", "date", "campaign date", "launched_at"],
    "impressions": ["impressions", "reach", "total_impressions"],
    "likes": ["likes", "total_likes"],
    "comments": ["comments", "total_comments"],
    "shares": ["shares", "total_shares"],
    "total_engagements": ["total_engagements", "engagements", "engagement_count"],
    "referral_id": ["referral_id", "referralid", "referral id", "click_id"],
    "traffic_source": ["traffic_source", "source", "channel", "referrer", "traffic source"],
    "click_timestamp": ["click_timestamp", "click_time", "clicked_at", "timestamp"],
    "customer_id": ["customer_id", "user_id", "customerid", "userid", "customer id"],
    "transaction_id": ["transaction_id", "purchase_id", "order_id", "txn_id", "transactionid"],
    "purchase_timestamp": ["purchase_timestamp", "order_timestamp", "purchase_time", "purchased_at"],
    "order_value": ["order_value", "amount", "revenue", "order_value_usd", "total_value"],
    "clicks": ["clicks", "click_count", "referral_clicks", "total_clicks"],
    "purchases": ["purchases", "purchase_count", "total_purchases"],
}


def match_columns(df: pd.DataFrame) -> Dict[str, str]:
    lower_map = {str(col).strip().lower(): col for col in df.columns}
    mapping: Dict[str, str] = {}

    for canonical, aliases in FIELD_ALIASES.items():
        for alias in aliases:
            normalized = alias.lower()
            if normalized in lower_map:
                mapping[canonical] = lower_map[normalized]
                break
    return mapping


def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    mapped = match_columns(df)
    # Reversing the mapping: pandas rename expects {old_name: new_name}
    rename_map = {v: k for k, v in mapped.items()}
    standardized = df.rename(columns=rename_map).copy()

    if "campaign_id" not in standardized.columns:
        standardized["campaign_id"] = "unknown"
    if "creator_id" not in standardized.columns:
        standardized["creator_id"] = "unknown"
    if "creator_name" not in standardized.columns:
        standardized["creator_name"] = standardized.get("creator_id", "unknown")
    if "traffic_source" not in standardized.columns:
        standardized["traffic_source"] = "unknown"
    if "clicks" not in standardized.columns and "click_timestamp" in standardized.columns:
        standardized["clicks"] = 1
    if "purchases" not in standardized.columns and "transaction_id" in standardized.columns:
        standardized["purchases"] = 1
    if "revenue" not in standardized.columns and "order_value" in standardized.columns:
        standardized["revenue"] = standardized["order_value"]

    return standardized


def ingest_raw_dataset(raw_file: str | Path | None = None) -> pd.DataFrame:
    file_path = Path(raw_file) if raw_file else discover_dataset()
    df = pd.read_csv(file_path)
    standardized = standardize_columns(df)
    result = validate_dataframe(standardized)
    fail_on_critical_errors(result)
    return standardized


def run_pipeline(raw_file: str | Path | None = None, output_path: str | Path | None = None) -> Path:
    file_path = Path(raw_file) if raw_file else discover_dataset()
    df = ingest_raw_dataset(file_path)
    PROCESSED_DIRECTORY.mkdir(parents=True, exist_ok=True)
    target = Path(output_path) if output_path else PROCESSED_DIRECTORY / "processed_dataset.csv"
    df.to_csv(target, index=False)
    return target


if __name__ == "__main__":
    output = run_pipeline()
    print(f"Processed dataset created at: {output}")
