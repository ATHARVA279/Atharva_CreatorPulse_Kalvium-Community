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
