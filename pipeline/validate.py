from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd


REQUIRED_COLUMNS = {
    "campaign_id",
    "creator_id",
    "creator_name",
    "campaign_date",
    "impressions",
    "likes",
    "comments",
    "shares",
    "referral_id",
    "traffic_source",
    "click_timestamp",
    "customer_id",
    "transaction_id",
    "purchase_timestamp",
    "order_value",
}


def validate_dataframe(df: pd.DataFrame) -> Dict[str, List[str]]:
    errors: List[str] = []
    warnings: List[str] = []

    if df.empty:
        return {"errors": ["Dataset is empty."], "warnings": []}

    missing = sorted(REQUIRED_COLUMNS - set(df.columns))
    if missing:
        errors.append(f"Missing required columns: {', '.join(missing)}")

    if df.duplicated(subset=list(df.columns)).any():
        warnings.append("Duplicate rows detected.")

    if "transaction_id" in df.columns and df["transaction_id"].duplicated().any():
        warnings.append("Duplicate transaction IDs detected.")

    if "campaign_date" in df.columns:
        bad_dates = df.loc[~pd.to_datetime(df["campaign_date"], errors="coerce").notna(), "campaign_date"]
        if not bad_dates.empty:
            errors.append(f"Invalid campaign dates found: {bad_dates.head(5).tolist()}")

    if "click_timestamp" in df.columns:
        bad_clicks = df.loc[~pd.to_datetime(df["click_timestamp"], errors="coerce").notna(), "click_timestamp"]
        if not bad_clicks.empty:
            errors.append(f"Invalid click timestamps found: {bad_clicks.head(5).tolist()}")

    if "purchase_timestamp" in df.columns:
        non_null_purchase_rows = df["purchase_timestamp"].notna() & df["purchase_timestamp"].astype(str).str.strip().ne("")
        bad_purchases = df.loc[
            non_null_purchase_rows & ~pd.to_datetime(df["purchase_timestamp"], errors="coerce").notna(),
            "purchase_timestamp",
        ]
        if not bad_purchases.empty:
            errors.append(f"Invalid purchase timestamps found: {bad_purchases.head(5).tolist()}")

    if "transaction_id" in df.columns:
        non_null_txn_rows = df["transaction_id"].notna() & df["transaction_id"].astype(str).str.strip().ne("")
        bad_txn_ids = df.loc[
            non_null_txn_rows & df["transaction_id"].astype(str).str.strip().eq(""),
            "transaction_id",
        ]
        if not bad_txn_ids.empty:
            warnings.append("Blank transaction IDs were found in non-purchase rows.")

    numeric_columns = [
        "impressions",
        "likes",
        "comments",
        "shares",
        "order_value",
    ]
    for col in numeric_columns:
        if col in df.columns:
            non_numeric = df.loc[~pd.to_numeric(df[col], errors="coerce").notna(), col]
            if not non_numeric.empty:
                errors.append(f"Non-numeric values found in {col}: {non_numeric.head(5).tolist()}")

    for col in ["impressions", "likes", "comments", "shares"]:
        if col in df.columns:
            negatives = df.loc[pd.to_numeric(df[col], errors="coerce") < 0, col]
            if not negatives.empty:
                errors.append(f"Negative values detected in {col}: {negatives.head(5).tolist()}")

    if "order_value" in df.columns:
        negatives = df.loc[pd.to_numeric(df["order_value"], errors="coerce") < 0, "order_value"]
        if not negatives.empty:
            errors.append(f"Negative purchase values detected: {negatives.head(5).tolist()}")

    if "customer_id" in df.columns:
        missing_customers = df["customer_id"].isna() | (df["customer_id"].astype(str).str.strip() == "")
        if missing_customers.any():
            warnings.append("Missing customer IDs were found.")

    if "creator_id" in df.columns:
        missing_creators = df["creator_id"].isna() | (df["creator_id"].astype(str).str.strip() == "")
        if missing_creators.any():
            errors.append("Missing creator IDs detected.")

    if "campaign_id" in df.columns:
        missing_campaigns = df["campaign_id"].isna() | (df["campaign_id"].astype(str).str.strip() == "")
        if missing_campaigns.any():
            errors.append("Missing campaign IDs detected.")

    if "impressions" in df.columns and "clicks" in df.columns:
        zeros = df["impressions"].replace(0, pd.NA)
        if zeros.notna().any():
            positive_impressions = pd.to_numeric(df["impressions"], errors="coerce")
            clicks = pd.to_numeric(df["clicks"], errors="coerce")
            if (positive_impressions > 0).any() and (clicks[positive_impressions > 0] > positive_impressions[positive_impressions > 0]).any():
                warnings.append("Clicks exceed impressions for at least one row; verify attribution logic.")

    return {"errors": errors, "warnings": warnings}


def fail_on_critical_errors(result: Dict[str, List[str]]) -> None:
    if result["errors"]:
        raise ValueError("Critical validation errors: " + "; ".join(result["errors"]))
