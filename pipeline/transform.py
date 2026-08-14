from __future__ import annotations

from typing import Dict, List

import numpy as np
import pandas as pd


def normalize_series(series: pd.Series) -> pd.Series:
    finite = pd.to_numeric(series, errors="coerce")
    if finite.empty or finite.dropna().empty:
        return pd.Series(0.0, index=series.index)
    min_val = finite.min()
    max_val = finite.max()
    if np.isclose(max_val, min_val):
        return pd.Series(1.0, index=series.index)
    return (finite - min_val) / (max_val - min_val)


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    if denominator is None or pd.isna(denominator) or abs(float(denominator)) < 1e-12:
        return default
    return float(numerator) / float(denominator)


def add_derived_metrics(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["campaign_date"] = pd.to_datetime(df["campaign_date"], errors="coerce")
    df["click_timestamp"] = pd.to_datetime(df["click_timestamp"], errors="coerce")
    df["purchase_timestamp"] = pd.to_datetime(df["purchase_timestamp"], errors="coerce")

    df["engagements"] = df[[col for col in ["likes", "comments", "shares"] if col in df.columns]].fillna(0).sum(axis=1)
    df["impressions"] = pd.to_numeric(df["impressions"], errors="coerce").fillna(0)
    df["order_value"] = pd.to_numeric(df["order_value"], errors="coerce").fillna(0)

    if "clicks" in df.columns:
        df["clicks"] = pd.to_numeric(df["clicks"], errors="coerce").fillna(0)
    else:
        df["clicks"] = np.where(df["traffic_source"].notna(), pd.to_numeric(df["impressions"], errors="coerce") * 0.0, 0)

    if "purchases" in df.columns:
        df["purchases"] = pd.to_numeric(df["purchases"], errors="coerce").fillna(0)
    else:
        df["purchases"] = np.where(df["transaction_id"].notna(), 1, 0)

    if "revenue" in df.columns:
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce").fillna(0)
    else:
        df["revenue"] = df["order_value"]

    df["engagement_rate"] = df.apply(lambda row: safe_divide(row["engagements"], row["impressions"], 0.0) * 100.0, axis=1)
    df["ctr"] = df.apply(lambda row: safe_divide(row["clicks"], row["impressions"], 0.0) * 100.0, axis=1)
    df["conversion_rate"] = df.apply(lambda row: safe_divide(row["purchases"], row["clicks"], 0.0) * 100.0, axis=1)
    df["revenue_per_click"] = df.apply(lambda row: safe_divide(row["revenue"], row["clicks"], 0.0), axis=1)
    df["revenue_per_conversion"] = df.apply(lambda row: safe_divide(row["revenue"], row["purchases"], 0.0), axis=1)

    return df


def creator_score(df: pd.DataFrame, weights: Dict[str, float] | None = None) -> pd.DataFrame:
    weights = weights or {"engagement_rate": 0.30, "conversion_rate": 0.30, "revenue_per_click": 0.20, "purchase_value": 0.20}
    output = df.copy()

    for metric in ["engagement_rate", "conversion_rate", "revenue_per_click", "purchase_value"]:
        if metric not in output.columns:
            if metric == "purchase_value":
                output[metric] = output["revenue"]
            else:
                output[metric] = 0.0

    normalized = {}
    for metric in ["engagement_rate", "conversion_rate", "revenue_per_click", "purchase_value"]:
        normalized[metric] = normalize_series(output[metric].fillna(0))

    output["creator_score"] = (
        normalized["engagement_rate"] * weights["engagement_rate"]
        + normalized["conversion_rate"] * weights["conversion_rate"]
        + normalized["revenue_per_click"] * weights["revenue_per_click"]
        + normalized["purchase_value"] * weights["purchase_value"]
    ) * 100.0

    return output


def aggregate_creator_metrics(df: pd.DataFrame) -> pd.DataFrame:
    grouped = df.groupby("creator_id", dropna=False).agg(
        creator_name=("creator_name", "first"),
        campaign_count=("campaign_id", "nunique"),
        total_impressions=("impressions", "sum"),
        total_engagements=("engagements", "sum"),
        total_clicks=("clicks", "sum"),
        total_purchases=("purchases", "sum"),
        total_revenue=("revenue", "sum"),
    ).reset_index()

    grouped["engagement_rate"] = grouped.apply(lambda row: safe_divide(row["total_engagements"], row["total_impressions"], 0.0) * 100.0, axis=1)
    grouped["ctr"] = grouped.apply(lambda row: safe_divide(row["total_clicks"], row["total_impressions"], 0.0) * 100.0, axis=1)
    grouped["conversion_rate"] = grouped.apply(lambda row: safe_divide(row["total_purchases"], row["total_clicks"], 0.0) * 100.0, axis=1)
    grouped["revenue_per_click"] = grouped.apply(lambda row: safe_divide(row["total_revenue"], row["total_clicks"], 0.0), axis=1)
    grouped["purchase_value"] = grouped.apply(lambda row: safe_divide(row["total_revenue"], row["total_purchases"], 0.0), axis=1)
    grouped["creator_score"] = grouped.apply(lambda row: row["engagement_rate"] * 0.3 + row["conversion_rate"] * 0.3 + row["revenue_per_click"] * 0.2 + row["purchase_value"] * 0.2, axis=1)

    return grouped


def aggregate_campaign_metrics(df: pd.DataFrame) -> pd.DataFrame:
    grouped = df.groupby("campaign_id", dropna=False).agg(
        creator_id=("creator_id", "first"),
        creator_name=("creator_name", "first"),
        campaign_date=("campaign_date", "max"),
        impressions=("impressions", "sum"),
        engagements=("engagements", "sum"),
        clicks=("clicks", "sum"),
        purchases=("purchases", "sum"),
        revenue=("revenue", "sum"),
    ).reset_index()

    grouped["engagement_rate"] = grouped.apply(lambda row: safe_divide(row["engagements"], row["impressions"], 0.0) * 100.0, axis=1)
    grouped["ctr"] = grouped.apply(lambda row: safe_divide(row["clicks"], row["impressions"], 0.0) * 100.0, axis=1)
    grouped["conversion_rate"] = grouped.apply(lambda row: safe_divide(row["purchases"], row["clicks"], 0.0) * 100.0, axis=1)
    grouped["revenue_per_click"] = grouped.apply(lambda row: safe_divide(row["revenue"], row["clicks"], 0.0), axis=1)
    grouped["purchase_value"] = grouped.apply(lambda row: safe_divide(row["revenue"], row["purchases"], 0.0), axis=1)

    return grouped


def aggregate_traffic_source_metrics(df: pd.DataFrame) -> pd.DataFrame:
    grouped = df.groupby("traffic_source", dropna=False).agg(
        clicks=("clicks", "sum"),
        purchases=("purchases", "sum"),
        revenue=("revenue", "sum"),
        impressions=("impressions", "sum"),
        engagements=("engagements", "sum"),
    ).reset_index()

    grouped["ctr"] = grouped.apply(lambda row: safe_divide(row["clicks"], row["impressions"], 0.0) * 100.0, axis=1)
    grouped["conversion_rate"] = grouped.apply(lambda row: safe_divide(row["purchases"], row["clicks"], 0.0) * 100.0, axis=1)
    grouped["revenue_per_click"] = grouped.apply(lambda row: safe_divide(row["revenue"], row["clicks"], 0.0), axis=1)
    return grouped
