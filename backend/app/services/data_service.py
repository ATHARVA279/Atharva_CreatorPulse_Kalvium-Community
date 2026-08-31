from __future__ import annotations

from pathlib import Path

import pandas as pd

from pipeline.ingest import ingest_raw_dataset
from pipeline.transform import add_derived_metrics, aggregate_campaign_metrics, aggregate_creator_metrics, aggregate_traffic_source_metrics, creator_score


DATASET_PATH = Path(__file__).resolve().parents[3] / "data" / "raw"


def _load_data() -> pd.DataFrame:
    raw_file = next(iter((DATASET_PATH).glob("*.csv")), None)
    if raw_file is None:
        raise FileNotFoundError("No raw dataset found in data/raw. Add a CSV file to begin the pipeline.")

    df = ingest_raw_dataset(raw_file)
    df = add_derived_metrics(df)
    df["purchase_value"] = pd.to_numeric(df.get("order_value", 0), errors="coerce").fillna(0)
    return creator_score(df)


def _safe_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _apply_filters(df: pd.DataFrame, **filters) -> pd.DataFrame:
    df = df.copy()

    # Creator filter (matches creator_id or creator_name)
    creator = filters.get("creator") or filters.get("creator_id")
    if creator:
        df = df[
            (df["creator_id"].astype(str).str.contains(str(creator), case=False, na=False)) |
            (df["creator_name"].astype(str).str.contains(str(creator), case=False, na=False))
        ]

    # Campaign filter (matches campaign_id or campaign_name)
    campaign = filters.get("campaign") or filters.get("campaign_id")
    if campaign:
        df = df[
            (df["campaign_id"].astype(str).str.contains(str(campaign), case=False, na=False)) |
            (df.get("campaign_name", pd.Series("", index=df.index)).astype(str).str.contains(str(campaign), case=False, na=False))
        ]

    # Date filters
    date_from = filters.get("date_from") or filters.get("start_date")
    if date_from:
        df = df[df["campaign_date"] >= pd.to_datetime(date_from)]

    date_to = filters.get("date_to") or filters.get("end_date")
    if date_to:
        df = df[df["campaign_date"] <= pd.to_datetime(date_to)]

    # Traffic source filter
    traffic_source = filters.get("traffic_source") or filters.get("source")
    if traffic_source:
        df = df[df["traffic_source"].astype(str).str.contains(str(traffic_source), case=False, na=False)]

    # Category filter (matches product_category or category)
    category = filters.get("product_category") or filters.get("category")
    if category:
        df = df[
            (df.get("product_category", pd.Series("", index=df.index)).astype(str).str.contains(str(category), case=False, na=False)) |
            (df.get("category", pd.Series("", index=df.index)).astype(str).str.contains(str(category), case=False, na=False))
        ]

    return df


def get_dashboard_summary(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    summary = {
        "total_campaigns": int(df["campaign_id"].nunique()),
        "total_creators": int(df["creator_id"].nunique()),
        "total_impressions": int(df["impressions"].sum()),
        "total_engagements": int(df["engagements"].sum()),
        "total_referral_clicks": int(df["clicks"].sum()),
        "total_purchases": int(df["purchases"].sum()),
        "overall_conversion_rate": _safe_float((df["purchases"].sum() / df["clicks"].sum()) * 100.0) if df["clicks"].sum() else 0.0,
        "total_attributed_revenue": float(df["revenue"].sum()),
    }
    return summary


def get_creator_rankings(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    data = aggregate_creator_metrics(df)
    return data[[
        "creator_id", "creator_name", "campaign_count", "engagement_rate", "ctr", 
        "conversion_rate", "total_purchases", "total_clicks", "repeat_purchase_rate", 
        "total_revenue", "revenue_per_click", "purchase_value", "creator_score"
    ]].rename(columns={
        "total_revenue": "revenue",
    }).to_dict(orient="records")


def get_creator_detail(creator_id: str, **filters):
    df = _load_data()
    df_filtered = _apply_filters(df, **filters)
    
    # Calculate score globally first to ensure consistency, then extract creator's row
    global_creators = aggregate_creator_metrics(df_filtered)
    creator_row = global_creators[global_creators["creator_id"].astype(str) == str(creator_id)]
    if creator_row.empty:
        return {"error": "Creator not found"}
        
    summary = creator_row.iloc[0].to_dict()
    return {
        "creator_id": creator_id,
        "creator_name": summary.get("creator_name", ""),
        "total_campaigns": int(summary.get("campaign_count", 0)),
        "total_impressions": int(summary.get("total_impressions", 0)),
        "total_engagements": int(summary.get("total_engagements", 0)),
        "total_clicks": int(summary.get("total_clicks", 0)),
        "total_purchases": int(summary.get("total_purchases", 0)),
        "total_revenue": float(summary.get("total_revenue", 0.0)),
        "engagement_rate": float(summary.get("engagement_rate", 0.0)),
        "ctr": float(summary.get("ctr", 0.0)),
        "conversion_rate": float(summary.get("conversion_rate", 0.0)),
        "revenue_per_click": float(summary.get("revenue_per_click", 0.0)),
        "purchase_value": float(summary.get("purchase_value", 0.0)),
        "creator_score": float(summary.get("creator_score", 0.0)),
    }


def get_campaigns(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    return aggregate_campaign_metrics(df).to_dict(orient="records")


def get_referral_sources(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    data = aggregate_traffic_source_metrics(df)
    return data.rename(columns={"traffic_source": "source_name"}).to_dict(orient="records")


def get_funnel(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    return {
        "impressions": int(df["impressions"].sum()),
        "engagements": int(df["engagements"].sum()),
        "referral_clicks": int(df["clicks"].sum()),
        "purchases": int(df["purchases"].sum()),
    }


def get_revenue(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    # Group by creator and aggregate revenue, purchases, and clicks
    grouped = df.groupby(["creator_id", "creator_name"], dropna=False).agg(
        revenue=("revenue", "sum"),
        purchases=("purchases", "sum"),
        clicks=("clicks", "sum"),
    ).reset_index()
    return grouped.rename(columns={"creator_name": "name"}).to_dict(orient="records")


def get_purchase_behaviour(**filters):
    df = _load_data()
    df = _apply_filters(df, **filters)
    repeat_purchases = float(df["repeat_purchases"].sum()) if "repeat_purchases" in df.columns else 0.0
    purchases = float(df["purchases"].sum())
    repeat_purchase_rate = (repeat_purchases / purchases * 100.0) if purchases > 0 else 0.0
    
    return {
        "repeat_purchase_rate": repeat_purchase_rate,
        "purchase_frequency": 0.0,
        "notes": "Repeat-purchase metrics calculated from dataset.",
    }
