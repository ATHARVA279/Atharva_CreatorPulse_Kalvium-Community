# CreatorPulse

CreatorPulse is a campaign analytics and sustainable customer acquisition dashboard built for creator-led growth teams. It combines a structured dataset, a Python data pipeline, and a FastAPI backend to surface creator performance, campaign efficiency, referral quality, and attributed revenue in a single dashboard.

The project keeps the existing React frontend largely intact while moving all KPI logic and data processing to the backend and data pipeline layers.

## What the project does

CreatorPulse helps answer questions like:

- Which creators are driving the most revenue and conversions?
- Which campaigns are most efficient by acquisition and engagement?
- Which referral channels are performing best?
- How much revenue is attributed to creator campaigns?
- Where conversion drops occur across the funnel?

It is designed for a data-first, analyst-friendly workflow instead of a mock dashboard-only prototype.

---

## Tech stack

Frontend:
- React + Vite
- JavaScript / JSX
- Recharts for visualizations
- Lucide icons for UI elements

Backend:
- Python
- FastAPI
- Pandas and NumPy for data processing
- SQLAlchemy-ready structure for PostgreSQL integration

Data layer:
- CSV ingestion
- Data validation and cleaning
- KPI transformation logic
- SQL schema and reporting queries

---

## Project structure

- `client/` – React frontend dashboard
- `backend/` – FastAPI API and service logic
- `pipeline/` – ingestion, validation, transformation, and loading logic
- `sql/` – PostgreSQL schema and KPI-ready SQL
- `data/raw/` – source CSV files
- `data/processed/` – generated processed outputs
- `tests/` – automated tests for validation and API routes

> Note: GitHub Actions is intentionally not included in this project.

### Frontend

The frontend lives in `client/` and already contains the dashboard structure for:

- summary KPI cards
- campaign acquisition trend chart
- referral source distribution
- revenue by creator chart
- repeat-purchase chart
- creator ranking table
- sidebar and top navigation

Key frontend files:

- `client/src/pages/Dashboard.jsx` – main dashboard page
- `client/src/components/Sidebar.jsx` – left navigation
- `client/src/components/Topbar.jsx` – header controls
- `client/src/components/StatCard.jsx` – summary metrics
- `client/src/components/CustomerAcquisitionChart.jsx` – campaign trend visualization
- `client/src/components/ReferralSources.jsx` – referral breakdown
- `client/src/components/RevenueInfluencers.jsx` – creator revenue chart
- `client/src/components/RepeatPurchaseChart.jsx` – repeat purchase trends
- `client/src/components/InfluencerTable.jsx` – creator performance table
- `client/src/services/api.js` – frontend API client for backend communication

### Backend

The backend is built in `backend/` and exposes REST endpoints that the frontend consumes.

Main backend files:

- `backend/app/main.py` – app bootstrap and CORS setup
- `backend/app/routes/dashboard.py` – dashboard summary endpoints
- `backend/app/routes/creators.py` – creator listing and detail endpoints
- `backend/app/routes/campaigns.py` – campaign metrics endpoints
- `backend/app/routes/referrals.py` – referral source endpoints
- `backend/app/routes/purchases.py` – purchase, revenue, and funnel endpoints
- `backend/app/services/data_service.py` – business logic for KPI aggregation and filtering
- `backend/app/schemas/` – request/response models
- `backend/app/database.py` – database configuration layer

The backend is responsible for:

- loading the source dataset
- validating required fields and malformed records
- normalizing columns and deriving KPI fields
- aggregating campaign, creator, and referral metrics
- returning clean JSON to the frontend
- keeping dashboard rules away from the React layer

---

## Data pipeline

The data pipeline lives in `pipeline/` and does the real analytical work.

### Files

- `pipeline/ingest.py` – reads raw CSV data and normalizes input columns
- `pipeline/validate.py` – checks for missing IDs, invalid dates, duplicates, negative values, and bad numeric data
- `pipeline/transform.py` – computes derived metrics such as CTR, engagement rate, conversion rate, and creator score
- `pipeline/load.py` – loads the processed dataset into a reusable output format

### Data model

The data is based on a flat table with campaign, referral, and purchase information merged into a single raw source. The pipeline maps raw fields into conceptual entities:

- Campaign metadata: campaign ID, creator ID, creator name, campaign date, impressions
- Engagement fields: likes, comments, shares
- Referral fields: traffic source, click timestamp, click count
- Purchase fields: customer ID, transaction ID, purchase timestamp, order value

This model allows the app to calculate:

- engagement rate
- click-through rate
- conversion rate
- revenue per click
- purchase value
- creator score

---

## SQL layer

The SQL folder contains schema and reporting logic for the database layer.

- `sql/schema.sql` – table structure for creators, campaigns, traffic sources, and purchases
- `sql/kpi_queries.sql` – KPI queries that mirror the Python aggregations

This gives the project a clean migration path to a real PostgreSQL-backed analytics product instead of remaining CSV-only.

---

## Current backend capabilities

The API currently supports dashboard-style data requests for:

- `GET /health` – health check
- `GET /api/dashboard/summary` – summary KPIs
- `GET /api/creators` – creator rankings and filtered creator data
- `GET /api/creators/{creator_id}` – single creator details
- `GET /api/campaigns` – campaign metrics
- `GET /api/referral-sources` – referral source performance
- `GET /api/revenue` – revenue by creator/campaign
- `GET /api/funnel` – funnel totals across impressions → engagements → clicks → purchases
- `GET /api/purchase-behaviour` – repeat-purchase placeholder and future behavioral metrics

The frontend calls these endpoints through `client/src/services/api.js`, keeping the dashboard UI as a thin presentation layer while the Python backend handles the logic.

---

## What can be done with this project

This project is ready for extension in multiple directions.

### Immediate possibilities

- Connect to a PostgreSQL database instead of CSV-only processing
- Add scheduled ingestion jobs for new campaign files
- Support date-range filters and campaign-level drill-downs
- Add auth and role-based access for teams and admins
- Add export features for CSV/PDF reporting

### Analytics opportunities

- cohort retention analysis
- CLV and LTV analysis
- predictive campaign performance scoring
- referral-to-sale attribution modeling
- creator quality scoring over time
- demand forecasting for acquisition campaigns

### Product possibilities

- admin dashboard for marketing ops teams
- creator marketplace and relationship management
- paid media optimization dashboard
- partnership performance tracking across multiple brands
- executive reporting with weekly/monthly snapshots

---

## Local setup

### 1. Create the environment

```bash
cd /Users/Atharva/Desktop/Atharva_CreatorPulse_Kalvium-Community
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Run the data pipeline

```bash
cd /Users/Atharva/Desktop/Atharva_CreatorPulse_Kalvium-Community
source .venv/bin/activate
python pipeline/ingest.py
```

### 3. Start the backend

```bash
cd /Users/Atharva/Desktop/Atharva_CreatorPulse_Kalvium-Community
source .venv/bin/activate
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

### 4. Start the frontend

```bash
cd /Users/Atharva/Desktop/Atharva_CreatorPulse_Kalvium-Community/client
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Then open:

```text
http://localhost:5173
```

---

## Validation and testing

Run the validation tests with:

```bash
cd /Users/Atharva/Desktop/Atharva_CreatorPulse_Kalvium-Community
source .venv/bin/activate
PYTHONPATH=. pytest -q tests/test_data_quality.py tests/test_api_routes.py
```

These checks cover:

- raw data quality validation
- malformed value detection
- required field checks
- API route regression checks

---

## Summary

CreatorPulse is a practical end-to-end analytics dashboard project that combines:

- a real React UI
- a Python-based data pipeline
- a FastAPI backend service layer
- SQL-ready analytics logic
- dataset-driven KPI generation

The core idea is simple: the frontend displays metrics, the backend computes them, and the data pipeline ensures that the numbers are clean, traceable, and business-ready.

