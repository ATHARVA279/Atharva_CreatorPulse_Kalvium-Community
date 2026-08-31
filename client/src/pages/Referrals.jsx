import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getReferralSources } from "../services/api";

const formatCurrency = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `₹${(num / 1000000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString()}`;
};

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

export default function ReferralsPage({ filters = {}, refreshTick = 0 }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReferrals() {
      try {
        setLoading(true);
        setError("");
        const data = await getReferralSources(filters);
        setSources(data || []);
      } catch (err) {
        setError(err.message || "Unable to load referral sources.");
      } finally {
        setLoading(false);
      }
    }

    loadReferrals();
  }, [filters, refreshTick]);

  const chartData = (sources || []).map((source) => ({
    source: source.traffic_source || source.source_name || "Source",
    clicks: Number(source.clicks || 0),
    purchases: Number(source.purchases || 0),
    revenue: Number(source.revenue || 0),
    conversion: Number(source.conversion_rate || 0),
  }));

  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);
  const totalPurchases = chartData.reduce((sum, item) => sum + item.purchases, 0);
  const overallConversionRate = totalClicks > 0 ? (totalPurchases / totalClicks) * 100 : 0;

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Referral Performance</h2>
          <p>Understand which traffic sources produce quality customers.</p>
        </div>
      </div>

      {error ? (
        <div className="empty-state"><strong>Referral data unavailable.</strong><span>{error}</span></div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="metric-card"><div className="metric-top"><span>Referral Clicks</span></div><p className="metric-value">{loading ? "--" : totalClicks.toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Purchases</span></div><p className="metric-value">{loading ? "--" : totalPurchases.toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Conversion Rate</span></div><p className="metric-value">{loading ? "--" : formatPercent(overallConversionRate)}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Revenue</span></div><p className="metric-value">{loading ? "--" : formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0))}</p></div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Revenue by traffic source</h3></div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#ebeff7" vertical={false} />
                  <XAxis dataKey="source" tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: "1px solid #e7ebf2" }} />
                  <Bar dataKey="revenue" fill="#0d5bd7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Source breakdown</h3></div>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th className="numeric">Clicks</th>
                    <th className="numeric">Purchases</th>
                    <th className="numeric">Conversion</th>
                    <th className="numeric">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(chartData || []).map((item) => (
                    <tr key={item.source}>
                      <td>{item.source}</td>
                      <td className="numeric">{Number(item.clicks || 0).toLocaleString()}</td>
                      <td className="numeric">{Number(item.purchases || 0).toLocaleString()}</td>
                      <td className="numeric">{formatPercent(item.conversion || 0)}</td>
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
