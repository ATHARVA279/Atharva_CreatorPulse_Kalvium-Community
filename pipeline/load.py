from __future__ import annotations

import os
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()
PROCESSED_DIR = Path(__file__).resolve().parent.parent / "data" / "processed"
DATABASE_URL = os.getenv("DATABASE_URL")


def save_processed_dataset(df: pd.DataFrame, output_path: str | Path | None = None) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    target = Path(output_path) if output_path else PROCESSED_DIR / "processed_dataset.csv"
    df.to_csv(target, index=False)
    return target


def _ensure_database_connection() -> str:
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not configured. Add it to your environment or .env file.")
    return DATABASE_URL


def _load_schema(engine) -> None:
    schema_path = Path(__file__).resolve().parent.parent / "sql" / "schema.sql"
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {schema_path}")
    with engine.begin() as connection:
        connection.execute(text(schema_path.read_text()))


def load_processed_data_to_postgres(df: pd.DataFrame, database_url: str | None = None) -> dict:
    url = database_url or _ensure_database_connection()
    engine = create_engine(url)

    _load_schema(engine)

    creators = (
        df[["creator_id", "creator_name"]]
        .drop_duplicates()
        .rename(columns={"creator_id": "creator_id", "creator_name": "creator_name"})
        .to_dict(orient="records")
    )

    campaigns = (
        df[["campaign_id", "creator_id", "creator_name", "campaign_date", "category", "impressions", "likes", "comments", "shares"]]
        .drop_duplicates(subset=["campaign_id"])
        .rename(columns={"campaign_date": "campaign_date", "category": "category", "impressions": "impressions", "likes": "likes", "comments": "comments", "shares": "shares"})
        .to_dict(orient="records")
    )

    referrals = (
        df[["referral_id", "campaign_id", "creator_id", "traffic_source", "click_timestamp", "customer_id", "referral_clicks"]]
        .drop_duplicates(subset=["referral_id"])
        .rename(columns={"referral_clicks": "clicks"})
        .to_dict(orient="records")
    )

    purchases = (
        df[["transaction_id", "customer_id", "creator_id", "campaign_id", "referral_id", "purchase_timestamp", "order_value", "product", "traffic_source"]]
        .drop_duplicates(subset=["transaction_id"])
        .rename(columns={"order_value": "order_value", "product": "product_category", "traffic_source": "traffic_source"})
        .to_dict(orient="records")
    )

    with engine.begin() as connection:
        if creators:
            connection.execute(text("DELETE FROM creators"))
            connection.execute(text("INSERT INTO creators (creator_id, creator_name) VALUES (:creator_id, :creator_name)"), creators)

        if campaigns:
            connection.execute(text("DELETE FROM campaigns"))
            connection.execute(text("INSERT INTO campaigns (campaign_id, creator_id, creator_name, campaign_date, category, impressions, likes, comments, shares) VALUES (:campaign_id, :creator_id, :creator_name, :campaign_date, :category, :impressions, :likes, :comments, :shares)"), campaigns)

        if referrals:
            connection.execute(text("DELETE FROM referrals"))
            connection.execute(text("INSERT INTO referrals (referral_id, campaign_id, creator_id, traffic_source, click_timestamp, customer_id, clicks) VALUES (:referral_id, :campaign_id, :creator_id, :traffic_source, :click_timestamp, :customer_id, :clicks)"), referrals)

        if purchases:
            connection.execute(text("DELETE FROM purchases"))
            connection.execute(text("INSERT INTO purchases (transaction_id, customer_id, creator_id, campaign_id, referral_id, purchase_timestamp, order_value, product_category, traffic_source) VALUES (:transaction_id, :customer_id, :creator_id, :campaign_id, :referral_id, :purchase_timestamp, :order_value, :product_category, :traffic_source)"), purchases)

    return {
        "creators": len(creators),
        "campaigns": len(campaigns),
        "referrals": len(referrals),
        "purchases": len(purchases),
    }


def run_load_pipeline(csv_path: str | Path | None = None, database_url: str | None = None) -> dict:
    file_path = Path(csv_path) if csv_path else Path(__file__).resolve().parent.parent / "data" / "raw" / "creatorpulse_dummy_dataset.csv"
    df = pd.read_csv(file_path)
    save_processed_dataset(df)
    return load_processed_data_to_postgres(df, database_url=database_url)


if __name__ == "__main__":
    result = run_load_pipeline()
    print(result)
