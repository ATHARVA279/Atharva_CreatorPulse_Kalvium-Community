from __future__ import annotations

import hashlib
import secrets
import uuid

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from backend.app.database import engine

PBKDF2_ITERATIONS = 120_000


def ensure_users_table() -> None:
    with engine.begin() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id            TEXT PRIMARY KEY,
                    email         TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name     TEXT,
                    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )
        conn.execute(
            text(
                "CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email))"
            )
        )


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    )
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        _algo, iterations, salt, digest = stored_hash.split("$")
        candidate = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations),
        )
        return secrets.compare_digest(candidate.hex(), digest)
    except (ValueError, TypeError):
        return False


def _user_payload(row: dict) -> dict:
    return {
        "id": row["id"],
        "email": row["email"],
        "full_name": row.get("full_name") or "",
    }


def signup(email: str, password: str, full_name: str = "") -> dict:
    normalized_email = email.strip().lower()
    if "@" not in normalized_email or "." not in normalized_email.split("@")[-1]:
        raise ValueError("Please enter a valid email address.")

    ensure_users_table()
    display_name = (full_name or "").strip()
    user_id = str(uuid.uuid4())

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO users (id, email, password_hash, full_name)
                    VALUES (:id, :email, :password_hash, :full_name)
                    """
                ),
                {
                    "id": user_id,
                    "email": normalized_email,
                    "password_hash": hash_password(password),
                    "full_name": display_name,
                },
            )
    except IntegrityError as exc:
        raise ValueError("An account with this email already exists.") from exc

    return {"id": user_id, "email": normalized_email, "full_name": display_name}


def login(email: str, password: str) -> dict:
    ensure_users_table()
    normalized_email = email.strip().lower()
    with engine.connect() as conn:
        result = conn.execute(
            text(
                """
                SELECT id, email, password_hash, full_name
                FROM users
                WHERE LOWER(email) = :email
                """
            ),
            {"email": normalized_email},
        )
        row = result.mappings().first()

    if not row or not verify_password(password, row["password_hash"]):
        raise ValueError("Invalid email or password.")

    return _user_payload(dict(row))
