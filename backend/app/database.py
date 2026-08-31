import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Load .env from project root (two levels up from this file)
load_dotenv(Path(__file__).resolve().parents[2] / ".env")
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://creatorpulse:creatorpulse@localhost:5432/creatorpulse",
)

# Supabase requires SSL — add sslmode=require if connecting to Supabase
# and the URL doesn't already have SSL params
connect_args = {}
if "supabase.co" in DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,   # Validates connection health before use
    pool_size=5,
    max_overflow=10,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection() -> bool:
    """Quick connectivity check — called at startup."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"[DB] Connection failed: {e}")
        return False
