"""
data_service.py
===============
All data now comes from the Supabase PostgreSQL database.
The four tables (creators, campaigns, referrals, purchases) and
three views (creator_performance, campaign_performance,
traffic_source_performance) are queried directly — no CSV reads.
"""
from __future__ import annotations

from typing import Any

from sqlalchemy import text

from backend.app.database import engine


# ── Internal helpers ─────────────────────────────────────────────────────────

def _safe_float(value) -> float:
    try:
        return float(value) if value is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


def _safe_int(value) -> int:
    try:
        return int(value) if value is not None else 0
    except (TypeError, ValueError):
        return 0


def _build_filter_clause(
    *,
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
    alias: str = "cp",          # table/view alias used in SELECT
    ts_col: str = "campaign_date",
) -> tuple[str, dict]:
    """
    Returns a (WHERE clause string, params dict) pair for the common filters.
    Only the conditions that actually have a value are added.
    """
    conditions: list[str] = []
    params: dict[str, Any] = {}

    if creator:
        conditions.append(
            f"(LOWER({alias}.creator_id) LIKE :creator OR LOWER({alias}.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"

    if campaign:
        conditions.append(f"LOWER({alias}.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"

    if date_from:
        conditions.append(f"{alias}.{ts_col} >= :date_from")
        params["date_from"] = date_from

    if date_to:
        conditions.append(f"{alias}.{ts_col} <= :date_to")
        params["date_to"] = date_to

    if traffic_source:
        conditions.append(f"LOWER({alias}.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"

    if product_category:
        conditions.append(f"LOWER({alias}.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    return where, params


def _query(sql: str, params: dict | None = None) -> list[dict]:
    """Execute a raw SQL string and return rows as a list of dicts."""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        cols = list(result.keys())
        return [dict(zip(cols, row)) for row in result.fetchall()]


# ── Public service functions ──────────────────────────────────────────────────

def get_dashboard_summary(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> dict:
    """
    Aggregate totals across campaigns, referrals and purchases,
    with optional date / creator / campaign / source / category filters.
    """
    # Build filter against the join of all four tables
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            COUNT(DISTINCT cp.campaign_id)   AS total_campaigns,
            COUNT(DISTINCT c.creator_id)     AS total_creators,
            COALESCE(SUM(cp.impressions), 0) AS total_impressions,
            COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS total_engagements,
            COALESCE(SUM(r.clicks), 0)       AS total_referral_clicks,
            COUNT(DISTINCT p.transaction_id) AS total_purchases,
            COALESCE(SUM(p.order_value), 0)  AS total_attributed_revenue
        FROM campaigns cp
        JOIN creators c   ON c.creator_id   = cp.creator_id
        LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p  ON p.referral_id = r.referral_id
        {where}
    """
    rows = _query(sql, params)
    row = rows[0] if rows else {}

    clicks  = _safe_int(row.get("total_referral_clicks", 0))
    purch   = _safe_int(row.get("total_purchases", 0))
    return {
        "total_campaigns":          _safe_int(row.get("total_campaigns")),
        "total_creators":           _safe_int(row.get("total_creators")),
        "total_impressions":        _safe_int(row.get("total_impressions")),
        "total_engagements":        _safe_int(row.get("total_engagements")),
        "total_referral_clicks":    clicks,
        "total_purchases":          purch,
        "overall_conversion_rate":  round((purch / clicks) * 100.0, 4) if clicks else 0.0,
        "total_attributed_revenue": _safe_float(row.get("total_attributed_revenue")),
    }


def get_creator_rankings(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> list[dict]:
    """
    Returns per-creator KPIs using the creator_performance view,
    with optional filters pushed into the base join query.
    """
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            c.creator_id,
            c.creator_name,
            COUNT(DISTINCT cp.campaign_id)   AS campaign_count,
            COALESCE(SUM(cp.impressions), 0) AS total_impressions,
            COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS total_engagements,
            COALESCE(SUM(r.clicks), 0)       AS total_clicks,
            COALESCE(SUM(p.order_value), 0)  AS revenue,
            COUNT(DISTINCT p.transaction_id) AS total_purchases,
            CASE WHEN COALESCE(SUM(cp.impressions),0) > 0
                 THEN ROUND((COALESCE(SUM(cp.likes+cp.comments+cp.shares),0)::numeric
                             / SUM(cp.impressions)) * 100, 4)
                 ELSE 0 END AS engagement_rate,
            CASE WHEN COALESCE(SUM(cp.impressions),0) > 0
                 THEN ROUND((COALESCE(SUM(r.clicks),0)::numeric
                             / SUM(cp.impressions)) * 100, 4)
                 ELSE 0 END AS ctr,
            CASE WHEN COALESCE(SUM(r.clicks),0) > 0
                 THEN ROUND((COUNT(DISTINCT p.transaction_id)::numeric
                             / SUM(r.clicks)) * 100, 4)
                 ELSE 0 END AS conversion_rate,
            CASE WHEN COALESCE(SUM(r.clicks),0) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0) / SUM(r.clicks), 4)
                 ELSE 0 END AS revenue_per_click,
            CASE WHEN COUNT(DISTINCT p.transaction_id) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0)
                             / COUNT(DISTINCT p.transaction_id), 4)
                 ELSE 0 END AS purchase_value,
            0.0 AS repeat_purchase_rate,
            0.0 AS creator_score
        FROM creators c
        LEFT JOIN campaigns cp ON cp.creator_id = c.creator_id
        LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p  ON p.referral_id = r.referral_id
        {where}
        GROUP BY c.creator_id, c.creator_name
        ORDER BY revenue DESC
    """
    rows = _query(sql, params)
    return [
        {
            "creator_id":          r["creator_id"],
            "creator_name":        r["creator_name"],
            "campaign_count":      _safe_int(r.get("campaign_count")),
            "total_impressions":   _safe_int(r.get("total_impressions")),
            "total_engagements":   _safe_int(r.get("total_engagements")),
            "total_clicks":        _safe_int(r.get("total_clicks")),
            "revenue":             _safe_float(r.get("revenue")),
            "total_purchases":     _safe_int(r.get("total_purchases")),
            "engagement_rate":     _safe_float(r.get("engagement_rate")),
            "ctr":                 _safe_float(r.get("ctr")),
            "conversion_rate":     _safe_float(r.get("conversion_rate")),
            "revenue_per_click":   _safe_float(r.get("revenue_per_click")),
            "purchase_value":      _safe_float(r.get("purchase_value")),
            "repeat_purchase_rate":0.0,
            "creator_score":       0.0,
        }
        for r in rows
    ]


def get_creator_detail(creator_id: str, **_filters) -> dict:
    sql = """
        SELECT
            c.creator_id,
            c.creator_name,
            COUNT(DISTINCT cp.campaign_id)   AS campaign_count,
            COALESCE(SUM(cp.impressions), 0) AS total_impressions,
            COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS total_engagements,
            COALESCE(SUM(r.clicks), 0)       AS total_clicks,
            COUNT(DISTINCT p.transaction_id) AS total_purchases,
            COALESCE(SUM(p.order_value), 0)  AS total_revenue,
            CASE WHEN COALESCE(SUM(cp.impressions),0) > 0
                 THEN ROUND((COALESCE(SUM(cp.likes+cp.comments+cp.shares),0)::numeric
                             / SUM(cp.impressions)) * 100, 4) ELSE 0 END AS engagement_rate,
            CASE WHEN COALESCE(SUM(cp.impressions),0) > 0
                 THEN ROUND((COALESCE(SUM(r.clicks),0)::numeric
                             / SUM(cp.impressions)) * 100, 4) ELSE 0 END AS ctr,
            CASE WHEN COALESCE(SUM(r.clicks),0) > 0
                 THEN ROUND((COUNT(DISTINCT p.transaction_id)::numeric
                             / SUM(r.clicks)) * 100, 4) ELSE 0 END AS conversion_rate,
            CASE WHEN COALESCE(SUM(r.clicks),0) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0) / SUM(r.clicks), 4)
                 ELSE 0 END AS revenue_per_click,
            CASE WHEN COUNT(DISTINCT p.transaction_id) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0)
                             / COUNT(DISTINCT p.transaction_id), 4)
                 ELSE 0 END AS purchase_value
        FROM creators c
        LEFT JOIN campaigns cp ON cp.creator_id = c.creator_id
        LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p  ON p.referral_id = r.referral_id
        WHERE c.creator_id = :creator_id
        GROUP BY c.creator_id, c.creator_name
    """
    rows = _query(sql, {"creator_id": creator_id})
    if not rows:
        return {"error": "Creator not found"}
    r = rows[0]
    return {
        "creator_id":       r["creator_id"],
        "creator_name":     r["creator_name"],
        "total_campaigns":  _safe_int(r.get("campaign_count")),
        "total_impressions":_safe_int(r.get("total_impressions")),
        "total_engagements":_safe_int(r.get("total_engagements")),
        "total_clicks":     _safe_int(r.get("total_clicks")),
        "total_purchases":  _safe_int(r.get("total_purchases")),
        "total_revenue":    _safe_float(r.get("total_revenue")),
        "engagement_rate":  _safe_float(r.get("engagement_rate")),
        "ctr":              _safe_float(r.get("ctr")),
        "conversion_rate":  _safe_float(r.get("conversion_rate")),
        "revenue_per_click":_safe_float(r.get("revenue_per_click")),
        "purchase_value":   _safe_float(r.get("purchase_value")),
        "creator_score":    0.0,
    }


def get_campaigns(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> list[dict]:
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(cp.creator_id) LIKE :creator OR LOWER(cp.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            cp.campaign_id,
            cp.creator_id,
            cp.creator_name,
            cp.campaign_date,
            cp.impressions,
            (cp.likes + cp.comments + cp.shares)  AS engagements,
            COUNT(DISTINCT r.referral_id)          AS clicks,
            COUNT(DISTINCT p.transaction_id)       AS purchases,
            COALESCE(SUM(p.order_value), 0)        AS revenue,
            CASE WHEN cp.impressions > 0
                 THEN ROUND(((cp.likes+cp.comments+cp.shares)::numeric
                             / cp.impressions) * 100, 4) ELSE 0 END AS engagement_rate,
            CASE WHEN cp.impressions > 0
                 THEN ROUND((COUNT(DISTINCT r.referral_id)::numeric
                             / cp.impressions) * 100, 4) ELSE 0 END AS ctr,
            CASE WHEN COUNT(DISTINCT r.referral_id) > 0
                 THEN ROUND((COUNT(DISTINCT p.transaction_id)::numeric
                             / COUNT(DISTINCT r.referral_id)) * 100, 4) ELSE 0 END AS conversion_rate,
            CASE WHEN COUNT(DISTINCT r.referral_id) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0)
                             / COUNT(DISTINCT r.referral_id), 4) ELSE 0 END AS revenue_per_click,
            CASE WHEN COUNT(DISTINCT p.transaction_id) > 0
                 THEN ROUND(COALESCE(SUM(p.order_value),0)
                             / COUNT(DISTINCT p.transaction_id), 4) ELSE 0 END AS purchase_value
        FROM campaigns cp
        LEFT JOIN referrals r ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p ON p.referral_id = r.referral_id
        {where}
        GROUP BY cp.campaign_id, cp.creator_id, cp.creator_name,
                 cp.campaign_date, cp.impressions, cp.likes, cp.comments, cp.shares
        ORDER BY cp.campaign_date DESC
    """
    rows = _query(sql, params)
    return [
        {
            **r,
            "campaign_date": str(r["campaign_date"]) if r.get("campaign_date") else None,
            "impressions":   _safe_int(r.get("impressions")),
            "engagements":   _safe_int(r.get("engagements")),
            "clicks":        _safe_int(r.get("clicks")),
            "purchases":     _safe_int(r.get("purchases")),
            "revenue":       _safe_float(r.get("revenue")),
            "engagement_rate":  _safe_float(r.get("engagement_rate")),
            "ctr":              _safe_float(r.get("ctr")),
            "conversion_rate":  _safe_float(r.get("conversion_rate")),
            "revenue_per_click":_safe_float(r.get("revenue_per_click")),
            "purchase_value":   _safe_float(r.get("purchase_value")),
        }
        for r in rows
    ]


def get_referral_sources(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> list[dict]:
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            r.traffic_source                       AS source_name,
            COUNT(DISTINCT r.referral_id)          AS clicks,
            COUNT(DISTINCT p.transaction_id)       AS purchases,
            COALESCE(SUM(p.order_value), 0)        AS revenue,
            COALESCE(SUM(cp.impressions), 0)       AS impressions,
            COALESCE(SUM(cp.likes+cp.comments+cp.shares), 0) AS engagements,
            CASE WHEN COALESCE(SUM(cp.impressions),0) > 0
                 THEN ROUND((COUNT(DISTINCT r.referral_id)::numeric
                             / SUM(cp.impressions)) * 100, 4) ELSE 0 END AS ctr,
            CASE WHEN COUNT(DISTINCT r.referral_id) > 0
                 THEN ROUND((COUNT(DISTINCT p.transaction_id)::numeric
                             / COUNT(DISTINCT r.referral_id)) * 100, 4) ELSE 0 END AS conversion_rate
        FROM referrals r
        LEFT JOIN campaigns cp ON cp.campaign_id = r.campaign_id
        LEFT JOIN purchases p  ON p.referral_id  = r.referral_id
        LEFT JOIN creators  c  ON c.creator_id   = cp.creator_id
        {where}
        GROUP BY r.traffic_source
        ORDER BY revenue DESC
    """
    rows = _query(sql, params)
    return [
        {
            "source_name":    r["source_name"],
            "clicks":         _safe_int(r.get("clicks")),
            "purchases":      _safe_int(r.get("purchases")),
            "revenue":        _safe_float(r.get("revenue")),
            "impressions":    _safe_int(r.get("impressions")),
            "engagements":    _safe_int(r.get("engagements")),
            "ctr":            _safe_float(r.get("ctr")),
            "conversion_rate":_safe_float(r.get("conversion_rate")),
        }
        for r in rows
    ]


def get_funnel(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> dict:
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            COALESCE(SUM(cp.impressions), 0)                  AS impressions,
            COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS engagements,
            COALESCE(SUM(r.clicks), 0)                         AS referral_clicks,
            COUNT(DISTINCT p.transaction_id)                   AS purchases
        FROM campaigns cp
        JOIN creators c   ON c.creator_id   = cp.creator_id
        LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p  ON p.referral_id = r.referral_id
        {where}
    """
    rows = _query(sql, params)
    row = rows[0] if rows else {}
    return {
        "impressions":     _safe_int(row.get("impressions")),
        "engagements":     _safe_int(row.get("engagements")),
        "referral_clicks": _safe_int(row.get("referral_clicks")),
        "purchases":       _safe_int(row.get("purchases")),
    }


def get_revenue(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> list[dict]:
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(r.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            c.creator_id,
            c.creator_name                         AS name,
            COALESCE(SUM(p.order_value), 0)        AS revenue,
            COUNT(DISTINCT p.transaction_id)       AS purchases,
            COALESCE(SUM(r.clicks), 0)             AS clicks
        FROM creators c
        LEFT JOIN campaigns cp ON cp.creator_id = c.creator_id
        LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
        LEFT JOIN purchases p  ON p.referral_id = r.referral_id
        {where}
        GROUP BY c.creator_id, c.creator_name
        ORDER BY revenue DESC
    """
    rows = _query(sql, params)
    return [
        {
            "creator_id": r["creator_id"],
            "name":       r["name"],
            "revenue":    _safe_float(r.get("revenue")),
            "purchases":  _safe_int(r.get("purchases")),
            "clicks":     _safe_int(r.get("clicks")),
        }
        for r in rows
    ]


def get_purchase_behaviour(
    creator: str | None = None,
    campaign: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    traffic_source: str | None = None,
    product_category: str | None = None,
) -> dict:
    conditions: list[str] = []
    params: dict = {}

    if creator:
        conditions.append(
            "(LOWER(c.creator_id) LIKE :creator OR LOWER(c.creator_name) LIKE :creator)"
        )
        params["creator"] = f"%{creator.lower()}%"
    if campaign:
        conditions.append("LOWER(cp.campaign_id) LIKE :campaign")
        params["campaign"] = f"%{campaign.lower()}%"
    if date_from:
        conditions.append("cp.campaign_date >= :date_from")
        params["date_from"] = date_from
    if date_to:
        conditions.append("cp.campaign_date <= :date_to")
        params["date_to"] = date_to
    if traffic_source:
        conditions.append("LOWER(p.traffic_source) LIKE :traffic_source")
        params["traffic_source"] = f"%{traffic_source.lower()}%"
    if product_category:
        conditions.append("LOWER(p.product_category) LIKE :product_category")
        params["product_category"] = f"%{product_category.lower()}%"

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            COUNT(DISTINCT p.customer_id)           AS unique_customers,
            COUNT(DISTINCT p.transaction_id)        AS total_purchases,
            COALESCE(SUM(p.order_value), 0)         AS total_revenue
        FROM purchases p
        LEFT JOIN referrals r  ON r.referral_id = p.referral_id
        LEFT JOIN campaigns cp ON cp.campaign_id = r.campaign_id
        LEFT JOIN creators c   ON c.creator_id   = cp.creator_id
        {where}
    """
    rows = _query(sql, params)
    row = rows[0] if rows else {}

    unique_customers = _safe_int(row.get("unique_customers"))
    total_purchases  = _safe_int(row.get("total_purchases"))
    purchase_freq    = round(total_purchases / unique_customers, 4) if unique_customers else 0.0

    return {
        "repeat_purchase_rate": 0.0,   # requires session/order-sequence data not in current schema
        "purchase_frequency":   purchase_freq,
        "unique_customers":     unique_customers,
        "total_purchases":      total_purchases,
        "total_revenue":        _safe_float(row.get("total_revenue")),
        "notes": "Repeat-purchase rate requires multi-order session data; purchase_frequency = purchases / unique customers.",
    }
