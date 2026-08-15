-- Creator ranking
SELECT
    creator_id,
    creator_name,
    engagement_rate,
    ctr,
    conversion_rate,
    total_revenue AS revenue,
    revenue_per_click,
    purchase_value,
    (engagement_rate * 0.30 + conversion_rate * 0.30 + revenue_per_click * 0.20 + purchase_value * 0.20) AS creator_score
FROM creator_performance
ORDER BY creator_score DESC;

-- Campaign performance
SELECT
    campaign_id,
    creator_name,
    campaign_date,
    impressions,
    engagements,
    clicks,
    purchases,
    revenue,
    engagement_rate,
    ctr,
    conversion_rate,
    revenue_per_click,
    purchase_value
FROM campaign_performance
ORDER BY campaign_date DESC;

-- Traffic source performance
SELECT
    traffic_source,
    clicks,
    purchases,
    revenue,
    ctr,
    conversion_rate
FROM traffic_source_performance
ORDER BY revenue DESC;
