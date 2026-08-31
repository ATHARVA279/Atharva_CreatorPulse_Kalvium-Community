import { useEffect, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCampaigns } from "../services/api";

const formatCurrency = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `₹${(num / 1000000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString()}`;
};

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

export default function CampaignsPage({ filters = {}, refreshTick = 0 }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true);
        setError("");
        const data = await getCampaigns(filters);
        setCampaigns(data || []);
      } catch (err) {
        setError(err.message || "Unable to load campaigns.");
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [filters, refreshTick]);

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "#fff", border: "1px solid #e7ebf2", padding: "10px", borderRadius: "12px", fontSize: "11px", boxShadow: "var(--shadow-soft)" }}>
          <p style={{ margin: 0, fontWeight: "bold", color: "var(--text-primary)" }}>Campaign: {data.campaign_id}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>Creator: {data.creator_name}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>Revenue: {formatCurrency(data.y)}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>Conversion Rate: {formatPercent(data.x)}</p>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>Purchases: {data.purchases}</p>
        </div>
      );
    }
    return null;
  };

  const chartData = campaigns.map((item) => ({
    x: Number(item.conversion_rate || 0),
    y: Number(item.revenue || 0),
    campaign_id: item.campaign_id,
    creator_name: item.creator_name || "Creator",
    purchases: Number(item.purchases || 0),
  }));

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Campaign Analytics</h2>
          <p>Compare acquisition, engagement and revenue across campaigns.</p>
        </div>
      </div>

      {error ? (
        <div className="empty-state"><strong>Campaign data unavailable.</strong><span>{error}</span></div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="metric-card"><div className="metric-top"><span>Campaigns</span></div><p className="metric-value">{loading ? "--" : campaigns.length}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Impressions</span></div><p className="metric-value">{loading ? "--" : campaigns.reduce((sum, item) => sum + Number(item.impressions || 0), 0).toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Engagements</span></div><p className="metric-value">{loading ? "--" : campaigns.reduce((sum, item) => sum + Number(item.engagements || 0), 0).toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Clicks</span></div><p className="metric-value">{loading ? "--" : campaigns.reduce((sum, item) => sum + Number(item.clicks || 0), 0).toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Purchases</span></div><p className="metric-value">{loading ? "--" : campaigns.reduce((sum, item) => sum + Number(item.purchases || 0), 0).toLocaleString()}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Revenue</span></div><p className="metric-value">{loading ? "--" : formatCurrency(campaigns.reduce((sum, item) => sum + Number(item.revenue || 0), 0))}</p></div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Campaign Revenue vs Conversion</h3></div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#ebeff7" vertical={false} />
                  <XAxis type="number" dataKey="x" name="Conversion Rate" unit="%" tick={{ fill: "#69778d", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="y" name="Revenue" tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={chartData} fill="#0d5bd7" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel" style={{ marginTop: "18px" }}>
            <div className="panel-header"><h3>Campaign Performance</h3></div>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Creator</th>
                    <th className="numeric">Impressions</th>
                    <th className="numeric">Engagement</th>
                    <th className="numeric">CTR</th>
                    <th className="numeric">Conv.</th>
                    <th className="numeric">Purchases</th>
                    <th className="numeric">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(campaigns || []).map((campaign) => (
                    <tr key={campaign.campaign_id || campaign.creator_id}>
                      <td>{campaign.campaign_id}</td>
                      <td>{campaign.creator_name || "Creator"}</td>
                      <td className="numeric">{Number(campaign.impressions || 0).toLocaleString()}</td>
                      <td className="numeric">{formatPercent(campaign.engagement_rate || 0)}</td>
                      <td className="numeric">{formatPercent(campaign.ctr || 0)}</td>
                      <td className="numeric">{formatPercent(campaign.conversion_rate || 0)}</td>
                      <td className="numeric">{Number(campaign.purchases || 0).toLocaleString()}</td>
                      <td className="numeric">{formatCurrency(campaign.revenue || 0)}</td>
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
