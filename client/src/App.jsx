import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import CampaignAnalytics from "./components/CampaignAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Campaign Analytics */}
        <Route
          path="/campaign-analytics"
          element={<CampaignAnalytics />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Future pages */}
        <Route
          path="/creators"
          element={<Dashboard />}
        />

        <Route
          path="/customers"
          element={<Dashboard />}
        />

        <Route
          path="/referral-tracking"
          element={<Dashboard />}
        />

        <Route
          path="/revenue-analytics"
          element={<Dashboard />}
        />

        <Route
          path="/clv"
          element={<Dashboard />}
        />

        <Route
          path="/retention-analysis"
          element={<Dashboard />}
        />

        <Route
          path="/sql-explorer"
          element={<Dashboard />}
        />

        <Route
          path="/settings"
          element={<Dashboard />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;