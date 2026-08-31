import { useEffect, useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getRevenue } from "../services/api";

const formatCurrency = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `₹${(num / 1000000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString()}`;
};

export default function RevenuePage({ filters = {}, refreshTick = 0 }) {
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRevenue() {
      try {
        setLoading(true);
        setError("");
        const data = await getRevenue(filters);
        setRevenue(data || []);
      } catch (err) {
        setError(err.message || "Unable to load revenue data.");
      } finally {
        setLoading(false);
      }
    }

    loadRevenue();
  }, [filters, refreshTick]);

  const totalRevenue = useMemo(() => revenue.reduce((sum, item) => sum + Number(item.revenue || 0), 0), [revenue]);
  const totalPurchases = useMemo(() => revenue.reduce((sum, item) => sum + Number(item.purchases || item.total_purchases || 0), 0), [revenue]);
  const totalClicks = useMemo(() => revenue.reduce((sum, item) => sum + Number(item.clicks || 0), 0), [revenue]);
  const revenuePerClick = totalClicks > 0 ? totalRevenue / totalClicks : 0;

  const sortedRevenueData = useMemo(() => {
    return [...revenue]
      .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0));
  }, [revenue]);

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Revenue Analytics</h2>
          <p>Understand where creator-attributed revenue is coming from.</p>
        </div>
      </div>

      {error ? (
        <div className="empty-state"><strong>Revenue data unavailable.</strong><span>{error}</span></div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="metric-card"><div className="metric-top"><span>Attributed Revenue</span></div><p className="metric-value">{loading ? "--" : formatCurrency(totalRevenue)}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Purchases</span></div><p className="metric-value">{loading ? "--" : totalPurchases.toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Revenue / Click</span></div><p className="metric-value">{loading ? "--" : formatCurrency(revenuePerClick)}</p></div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Revenue by creator</h3></div>
            <div className="chart-shell" style={{ height: "320px" }}>
              {loading ? (
                <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={sortedRevenueData.slice(0, 10)}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#ebeff7" horizontal={false} vertical={true} />
                    <XAxis type="number" tick={{ fill: "#69778d", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#69778d", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e7ebf2" }} />
                    <Bar dataKey="revenue" fill="#1d865d" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Revenue by creator</h3></div>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Creator</th>
                    <th className="numeric">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRevenueData.slice(0, 10).map((item) => (
                    <tr key={item.creator_id || item.name}>
                      <td>{item.name || item.creator_name || "Creator"}</td>
                      <td className="numeric">{formatCurrency(item.revenue || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
