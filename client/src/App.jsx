import { useState, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/Campaigns";
import CreatorsPage from "./pages/Creators";
import ReferralsPage from "./pages/Referrals";
import RevenuePage from "./pages/Revenue";
import Signup from "./pages/Signup";
import SettingsPage from "./pages/Settings";
import { exportPageCsv } from "./utils/exportPageCsv";

const CREATORS = [
  "Aarav Mehta", "Aditya Deshmukh", "Ananya Sharma", "Arjun Rao", 
  "Diya Joshi", "Isha Verma", "Kabir Singh", "Kavya Iyer", 
  "Meera Nair", "Rohan Kapoor", "Sara Khan", "Vihaan Patel"
];

const TRAFFIC_SOURCES = ["Direct", "Email", "Facebook", "Google", "Instagram", "TikTok", "YouTube"];

const CATEGORIES = ["Beauty", "Electronics", "Fashion", "Fitness", "Gaming", "Home", "Travel"];

const getDateFilter = (range) => {
  const maxDate = new Date("2026-06-30");
  let fromDate;
  switch (range) {
    case "last_7_days":
      fromDate = new Date(maxDate);
      fromDate.setDate(maxDate.getDate() - 7);
      return { date_from: fromDate.toISOString().split("T")[0], date_to: "2026-06-30" };
    case "last_30_days":
      fromDate = new Date(maxDate);
      fromDate.setDate(maxDate.getDate() - 30);
      return { date_from: fromDate.toISOString().split("T")[0], date_to: "2026-06-30" };
    case "last_90_days":
      fromDate = new Date(maxDate);
      fromDate.setDate(maxDate.getDate() - 90);
      return { date_from: fromDate.toISOString().split("T")[0], date_to: "2026-06-30" };
    case "this_quarter":
      return { date_from: "2026-04-01", date_to: "2026-06-30" };
    default:
      return {};
  }
};

function App() {
  const location = useLocation();
  const [dateRange, setDateRange] = useState("last_90_days");
  
  // Filter States
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [refreshTick, setRefreshTick] = useState(0);
  const [exporting, setExporting] = useState(false);

  const filters = useMemo(() => {
    const dates = getDateFilter(dateRange);
    return {
      ...dates,
      creator: selectedCreator,
      campaign: selectedCampaign,
      traffic_source: selectedSource,
      product_category: selectedCategory,
    };
  }, [dateRange, selectedCreator, selectedCampaign, selectedSource, selectedCategory]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (isAuthPage) {
    if (isAuthenticated) {
      return <Navigate to="/overview" replace />;
    }
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/overview": return "Overview";
      case "/campaigns": return "Campaign Analytics";
      case "/creators": return "Creators";
      case "/referrals": return "Referral Tracking";
      case "/revenue": return "Revenue Analytics";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-panel">
        <Topbar
          title={getPageTitle()}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={() => setRefreshTick((tick) => tick + 1)}
          exporting={exporting}
          showExport={location.pathname !== "/settings"}
          onExport={async () => {
            if (exporting || location.pathname === "/settings") return;
            try {
              setExporting(true);
              await exportPageCsv(location.pathname, filters);
            } catch (error) {
              window.alert(error.message || "Unable to export CSV. Check that the API is running.");
            } finally {
              setExporting(false);
            }
          }}
        />

        {location.pathname !== "/settings" && (
          <div className="filter-bar" style={{
            padding: "12px 28px",
            background: "rgba(255, 255, 255, 0.6)",
            borderBottom: "1px solid var(--border-soft)",
            display: "flex",
            gap: "18px",
            alignItems: "center",
            flexWrap: "wrap",
            backdropFilter: "blur(8px)"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "9px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Creator</label>
              <select
                value={selectedCreator}
                onChange={(e) => setSelectedCreator(e.target.value)}
                style={{
                  height: "32px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-soft)",
                  outline: "none",
                  fontSize: "11px",
                  background: "#fff",
                  color: "var(--text-primary)",
                  minWidth: "140px"
                }}
              >
                <option value="">All Creators</option>
                {CREATORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "9px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Campaign ID</label>
              <input
                type="text"
                placeholder="Search Campaign ID"
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                style={{
                  height: "32px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-soft)",
                  outline: "none",
                  fontSize: "11px",
                  background: "#fff",
                  color: "var(--text-primary)",
                  minWidth: "140px"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "9px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Traffic Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                style={{
                  height: "32px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-soft)",
                  outline: "none",
                  fontSize: "11px",
                  background: "#fff",
                  color: "var(--text-primary)",
                  minWidth: "120px"
                }}
              >
                <option value="">All Sources</option>
                {TRAFFIC_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "9px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  height: "32px",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-soft)",
                  outline: "none",
                  fontSize: "11px",
                  background: "#fff",
                  color: "var(--text-primary)",
                  minWidth: "120px"
                }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedCreator("");
                setSelectedCampaign("");
                setSelectedSource("");
                setSelectedCategory("");
                setDateRange("last_90_days");
              }}
              style={{
                alignSelf: "flex-end",
                height: "32px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-soft)",
                color: "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="page-shell">
          <Routes>
            <Route path="/overview" element={<Dashboard filters={filters} refreshTick={refreshTick} />} />
            <Route path="/campaigns" element={<CampaignsPage filters={filters} refreshTick={refreshTick} />} />
            <Route path="/creators" element={<CreatorsPage filters={filters} refreshTick={refreshTick} />} />
            <Route path="/referrals" element={<ReferralsPage filters={filters} refreshTick={refreshTick} />} />
            <Route path="/revenue" element={<RevenuePage filters={filters} refreshTick={refreshTick} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;