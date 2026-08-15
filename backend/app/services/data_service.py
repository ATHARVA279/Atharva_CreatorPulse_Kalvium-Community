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


def get_dashboard_summary():
    df = _load_data()
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
    if filters.get("creator"):
        df = df[df["creator_name"].astype(str).str.contains(filters["creator"], case=False, na=False)]
    if filters.get("campaign"):
        df = df[df["campaign_id"].astype(str).str.contains(filters["campaign"], case=False, na=False)]
    if filters.get("date_from"):
        df = df[df["campaign_date"] >= pd.to_datetime(filters["date_from"]) ]
    if filters.get("date_to"):
        df = df[df["campaign_date"] <= pd.to_datetime(filters["date_to"]) ]
    if filters.get("traffic_source"):
        df = df[df["traffic_source"].astype(str).str.contains(filters["traffic_source"], case=False, na=False)]
    if filters.get("product_category"):
        df = df[df.get("product_category", pd.Series(["" for _ in range(len(df))], index=df.index)).astype(str).str.contains(filters["product_category"], case=False, na=False)]

    data = aggregate_creator_metrics(df)
    return data[["creator_id", "creator_name", "engagement_rate", "ctr", "conversion_rate", "total_revenue", "revenue_per_click", "purchase_value", "creator_score"]].rename(columns={
        "total_revenue": "revenue",
    }).to_dict(orient="records")


def get_creator_detail(creator_id: str):
    df = _load_data()
    creator_df = df[df["creator_id"].astype(str) == str(creator_id)]
    if creator_df.empty:
        return {"error": "Creator not found"}
    summary = aggregate_creator_metrics(creator_df).iloc[0].to_dict()
    return {
        "creator_id": creator_id,
        "creator_name": summary.get("creator_name", creator_df["creator_name"].iloc[0]),
        "total_campaigns": int(creator_df["campaign_id"].nunique()),
        "total_impressions": int(creator_df["impressions"].sum()),
        "total_engagements": int(creator_df["engagements"].sum()),
        "total_clicks": int(creator_df["clicks"].sum()),
        "total_purchases": int(creator_df["purchases"].sum()),
        "total_revenue": float(creator_df["revenue"].sum()),
        "engagement_rate": float(summary.get("engagement_rate", 0.0)),
        "ctr": float(summary.get("ctr", 0.0)),
        "conversion_rate": float(summary.get("conversion_rate", 0.0)),
        "revenue_per_click": float(summary.get("revenue_per_click", 0.0)),
        "purchase_value": float(summary.get("purchase_value", 0.0)),
        "creator_score": float(summary.get("creator_score", 0.0)),
    }


def get_campaigns(**filters):
    df = _load_data()
    if filters.get("creator"):
        df = df[df["creator_name"].astype(str).str.contains(filters["creator"], case=False, na=False)]
    if filters.get("campaign"):
        df = df[df["campaign_id"].astype(str).str.contains(filters["campaign"], case=False, na=False)]
    if filters.get("date_from"):
        df = df[df["campaign_date"] >= pd.to_datetime(filters["date_from"])]
    if filters.get("date_to"):
        df = df[df["campaign_date"] <= pd.to_datetime(filters["date_to"])]
    return aggregate_campaign_metrics(df).to_dict(orient="records")


def get_referral_sources(**filters):
    df = _load_data()
    if filters.get("creator"):
        df = df[df["creator_name"].astype(str).str.contains(filters["creator"], case=False, na=False)]
    if filters.get("campaign"):
        df = df[df["campaign_id"].astype(str).str.contains(filters["campaign"], case=False, na=False)]
    if filters.get("date_from"):
        df = df[df["campaign_date"] >= pd.to_datetime(filters["date_from"])]
    if filters.get("date_to"):
        df = df[df["campaign_date"] <= pd.to_datetime(filters["date_to"])]
    data = aggregate_traffic_source_metrics(df)
    return data.rename(columns={"traffic_source": "source_name"}).to_dict(orient="records")


def get_funnel():
    df = _load_data()
    return {
        "impressions": int(df["impressions"].sum()),
        "engagements": int(df["engagements"].sum()),
        "referral_clicks": int(df["clicks"].sum()),
        "purchases": int(df["purchases"].sum()),
    }


def get_revenue(**filters):
    df = _load_data()
    if filters.get("creator"):
        df = df[df["creator_name"].astype(str).str.contains(filters["creator"], case=False, na=False)]
    if filters.get("campaign"):
        df = df[df["campaign_id"].astype(str).str.contains(filters["campaign"], case=False, na=False)]
    grouped = df.groupby(["creator_id", "creator_name"], dropna=False)["revenue"].sum().reset_index()
    return grouped.rename(columns={"creator_name": "name"}).to_dict(orient="records")


def get_purchase_behaviour(**filters):
    df = _load_data()
    if filters.get("creator"):
        df = df[df["creator_name"].astype(str).str.contains(filters["creator"], case=False, na=False)]
    if filters.get("campaign"):
        df = df[df["campaign_id"].astype(str).str.contains(filters["campaign"], case=False, na=False)]
    return {
        "repeat_purchase_rate": 0.0,
        "purchase_frequency": 0.0,
        "notes": "Repeat-purchase metrics are only available when a longitudinal customer purchase history exists in the dataset.",
    }
