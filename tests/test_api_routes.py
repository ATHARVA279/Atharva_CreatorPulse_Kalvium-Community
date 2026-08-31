import uuid

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_dashboard_summary_route_works():
    response = client.get('/api/dashboard/summary')
    assert response.status_code == 200
    payload = response.json()
    assert 'total_campaigns' in payload
    assert 'total_creators' in payload


def test_revenue_route_works():
    response = client.get('/api/revenue')
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)


def test_signup_and_login_against_database():
    email = f"qa-{uuid.uuid4().hex[:12]}@creatorpulse.test"
    password = "securepass123"
    signup = client.post(
        "/api/auth/signup",
        json={"email": email, "password": password, "full_name": "QA User"},
    )
    assert signup.status_code == 201
    created = signup.json()["user"]
    assert created["email"] == email
    assert created["full_name"] == "QA User"

    duplicate = client.post(
        "/api/auth/signup",
        json={"email": email, "password": password, "full_name": "QA User"},
    )
    assert duplicate.status_code == 409

    bad_login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "wrong-password"},
    )
    assert bad_login.status_code == 401

    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200
    assert login.json()["user"]["email"] == email
