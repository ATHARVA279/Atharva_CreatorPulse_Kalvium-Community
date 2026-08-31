-- ============================================================
-- CreatorPulse Schema for Supabase PostgreSQL
-- ============================================================

-- Tables
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS creators (
    creator_id TEXT PRIMARY KEY,
    creator_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
    campaign_id   TEXT PRIMARY KEY,
    creator_id    TEXT REFERENCES creators(creator_id),
    creator_name  TEXT,
    campaign_date DATE,
    category      TEXT,
    impressions   INTEGER,
    likes         INTEGER,
    comments      INTEGER,
    shares        INTEGER,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
    referral_id     TEXT PRIMARY KEY,
    creator_id      TEXT REFERENCES creators(creator_id),
    campaign_id     TEXT REFERENCES campaigns(campaign_id),
    traffic_source  TEXT,
    click_timestamp TIMESTAMP,
    customer_id     TEXT,
    clicks          INTEGER DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    transaction_id     TEXT PRIMARY KEY,
    customer_id        TEXT,
    creator_id         TEXT REFERENCES creators(creator_id),
    campaign_id        TEXT REFERENCES campaigns(campaign_id),
    referral_id        TEXT REFERENCES referrals(referral_id),
    purchase_timestamp TIMESTAMP,
    order_value        NUMERIC(12,2),
    product_category   TEXT,
    traffic_source     TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Views  (use CREATE OR REPLACE — PostgreSQL does not support
--          CREATE VIEW IF NOT EXISTS)
-- ============================================================

CREATE OR REPLACE VIEW creator_performance AS
SELECT
    c.creator_id,
    c.creator_name,
    COUNT(DISTINCT cp.campaign_id) AS campaign_count,
    COALESCE(SUM(cp.impressions), 0) AS total_impressions,
    COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS total_engagements,
    COALESCE(SUM(r.clicks), 0) AS total_clicks,
    COALESCE(SUM(p.order_value), 0) AS total_revenue,
    COALESCE(COUNT(DISTINCT p.transaction_id), 0) AS total_purchases,
    CASE WHEN COALESCE(SUM(cp.impressions), 0) > 0
         THEN (COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0)::numeric / SUM(cp.impressions)) * 100
         ELSE 0 END AS engagement_rate,
    CASE WHEN COALESCE(SUM(cp.impressions), 0) > 0
         THEN (COALESCE(SUM(r.clicks), 0)::numeric / SUM(cp.impressions)) * 100
         ELSE 0 END AS ctr,
    CASE WHEN COALESCE(SUM(r.clicks), 0) > 0
         THEN (COUNT(DISTINCT p.transaction_id)::numeric / SUM(r.clicks)) * 100
         ELSE 0 END AS conversion_rate,
    CASE WHEN COALESCE(SUM(r.clicks), 0) > 0
         THEN COALESCE(SUM(p.order_value), 0) / SUM(r.clicks)
         ELSE 0 END AS revenue_per_click,
    CASE WHEN COUNT(DISTINCT p.transaction_id) > 0
         THEN COALESCE(SUM(p.order_value), 0) / COUNT(DISTINCT p.transaction_id)
         ELSE 0 END AS purchase_value
FROM creators c
LEFT JOIN campaigns cp ON cp.creator_id = c.creator_id
LEFT JOIN referrals r  ON r.campaign_id = cp.campaign_id
LEFT JOIN purchases p  ON p.referral_id = r.referral_id
GROUP BY c.creator_id, c.creator_name;

CREATE OR REPLACE VIEW campaign_performance AS
SELECT
    cp.campaign_id,
    cp.creator_id,
    cp.creator_name,
    cp.campaign_date,
    cp.impressions,
    (cp.likes + cp.comments + cp.shares) AS engagements,
    COUNT(DISTINCT r.referral_id)   AS clicks,
    COUNT(DISTINCT p.transaction_id) AS purchases,
    COALESCE(SUM(p.order_value), 0)  AS revenue,
    CASE WHEN cp.impressions > 0
         THEN ((cp.likes + cp.comments + cp.shares)::numeric / cp.impressions) * 100
         ELSE 0 END AS engagement_rate,
    CASE WHEN cp.impressions > 0
         THEN (COUNT(DISTINCT r.referral_id)::numeric / cp.impressions) * 100
         ELSE 0 END AS ctr,
    CASE WHEN COUNT(DISTINCT r.referral_id) > 0
         THEN (COUNT(DISTINCT p.transaction_id)::numeric / COUNT(DISTINCT r.referral_id)) * 100
         ELSE 0 END AS conversion_rate,
    CASE WHEN COUNT(DISTINCT r.referral_id) > 0
         THEN COALESCE(SUM(p.order_value), 0) / COUNT(DISTINCT r.referral_id)
         ELSE 0 END AS revenue_per_click,
    CASE WHEN COUNT(DISTINCT p.transaction_id) > 0
         THEN COALESCE(SUM(p.order_value), 0) / COUNT(DISTINCT p.transaction_id)
         ELSE 0 END AS purchase_value
FROM campaigns cp
LEFT JOIN referrals r ON r.campaign_id = cp.campaign_id
LEFT JOIN purchases p ON p.referral_id = r.referral_id
GROUP BY cp.campaign_id, cp.creator_id, cp.creator_name, cp.campaign_date,
         cp.impressions, cp.likes, cp.comments, cp.shares;

CREATE OR REPLACE VIEW traffic_source_performance AS
SELECT
    r.traffic_source,
    COUNT(DISTINCT r.referral_id)    AS clicks,
    COUNT(DISTINCT p.transaction_id) AS purchases,
    COALESCE(SUM(p.order_value), 0)  AS revenue,
    COALESCE(SUM(cp.impressions), 0) AS impressions,
    COALESCE(SUM(cp.likes + cp.comments + cp.shares), 0) AS engagements,
    CASE WHEN COALESCE(SUM(cp.impressions), 0) > 0
         THEN (COUNT(DISTINCT r.referral_id)::numeric / SUM(cp.impressions)) * 100
         ELSE 0 END AS ctr,
    CASE WHEN COUNT(DISTINCT r.referral_id) > 0
         THEN (COUNT(DISTINCT p.transaction_id)::numeric / COUNT(DISTINCT r.referral_id)) * 100
         ELSE 0 END AS conversion_rate
FROM referrals r
LEFT JOIN campaigns cp ON cp.campaign_id = r.campaign_id
LEFT JOIN purchases p  ON p.referral_id  = r.referral_id
GROUP BY r.traffic_source;
