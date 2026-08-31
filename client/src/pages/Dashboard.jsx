import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Funnel,
  Megaphone,
  MousePointerClick,
  Users,
} from "lucide-react";
import {
  getCampaigns,
  getCreatorRankings,
  getDashboardSummary,
  getFunnel,
  getReferralSources,
  getRevenue,
} from "../services/api";

const formatCompact = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  const num = Number(value);
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toLocaleString();
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `₹${(num / 1000000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString()}`;
};

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

const metricIcons = [Users, Megaphone, MousePointerClick, BarChart3, Funnel, CircleDollarSign];

export default function Dashboard({ filters = {}, refreshTick = 0 }) {
  const [summary, setSummary] = useState(null);
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [summaryData, creatorsData, campaignsData, referralData, revenueData, funnelData] = await Promise.all([
          getDashboardSummary(filters),
          getCreatorRankings(filters),
          getCampaigns(filters),
          getReferralSources(filters),
          getRevenue(filters),
          getFunnel(filters),
        ]);

        setSummary(summaryData);
        setCreators(creatorsData || []);
        setCampaigns(campaignsData || []);
        setReferrals(referralData || []);
        setRevenue(revenueData || []);
        setFunnel(funnelData || null);
      } catch (err) {
        setError(err.message || "Unable to load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filters, refreshTick]);

  const kpis = useMemo(() => {
    const source = summary || {};
    return [
      { title: "Total Creators", value: source.total_creators ?? 0, change: "Live", icon: metricIcons[0], positive: true },
      { title: "Active Campaigns", value: source.total_campaigns ?? 0, change: "Running", icon: metricIcons[1], positive: true },
      { title: "Referral Clicks", value: formatCompact(source.total_referral_clicks ?? 0), change: "Attribution", icon: metricIcons[2], positive: true },
      { title: "Customers Acquired", value: formatCompact(source.total_purchases ?? 0), change: "All channels", icon: metricIcons[3], positive: true },
      { title: "Conversion Rate", value: formatPercent(source.overall_conversion_rate ?? 0), change: "By clicks", icon: metricIcons[4], positive: true },
      { title: "Attributed Revenue", value: formatCurrency(source.total_attributed_revenue ?? 0), change: "During period", icon: metricIcons[5], positive: true },
    ];
  }, [summary]);

  const acquisitionData = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => new Date(a.campaign_date || 0) - new Date(b.campaign_date || 0))
      .map((campaign) => ({
        date: campaign.campaign_date ? new Date(campaign.campaign_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "-",
        customers: Number(campaign.purchases || 0),
        purchases: Number(campaign.purchases || 0),
        clicks: Number(campaign.clicks || 0),
      }));
  }, [campaigns]);

  const scatterData = useMemo(() =>
    creators.map((creator) => ({
      x: Number(creator.engagement_rate || 0),
      y: Number(creator.conversion_rate || 0),
      z: Number(creator.revenue || 0),
      name: creator.creator_name || creator.creator_id || "Creator",
      ctr: Number(creator.ctr || 0),
      revenue: Number(creator.revenue || 0),
      score: Number(creator.creator_score || 0),
    })),
  [creators]);

  const funnelStages = useMemo(() => {
    if (!funnel) return [];
    const stages = [
      { label: "Impressions", value: Number(funnel.impressions || 0) },
      { label: "Engagements", value: Number(funnel.engagements || 0) },
      { label: "Referral Clicks", value: Number(funnel.referral_clicks || 0) },
      { label: "Purchases", value: Number(funnel.purchases || 0) },
    ];

    let previous = null;
    return stages.map((stage) => {
      const retention = previous ? (stage.value / previous) * 100 : 100;
      previous = stage.value;
      return { ...stage, retention };
    });
  }, [funnel]);

  const sortedRevenueData = useMemo(() => {
    return [...revenue]
      .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0));
  }, [revenue]);

  return (
    <div className="section">
      <div className="section-header" style={{ marginBottom: "18px" }}>
        <div>
          <h2>Creator Performance</h2>
          <p>Understand how creator engagement translates into customer acquisition.</p>
        </div>
      </div>

      {error && (
        <div className="empty-state" style={{ marginBottom: "18px" }}>
          <strong>Unable to load campaign data.</strong>
          <span>{error}</span>
          <button type="button" className="toolbar-button primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!error && (
        <>
          <div className="kpi-grid">
            {kpis.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.title} className="metric-card">
                  <div className="metric-top">
                    <span>{metric.title}</span>
                    <div className="icon-box"><Icon size={15} /></div>
                  </div>

                  <p className="metric-value">
                    {loading ? "--" : metric.value}
                  </p>

                  <div className={`metric-trend ${metric.positive ? "positive" : "neutral"}`}>
                    <ArrowRight size={12} />
                    {loading ? "Loading" : metric.change}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chart-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Customer Acquisition</h3>
                <div className="legend"><span className="swatch" style={{ background: "#0d5bd7" }} /> Customers</div>
              </div>
              <div className="chart-shell">
                {loading ? (
                  <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={acquisitionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="acqFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d5bd7" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#0d5bd7" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ebeff7" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [value, "Customers"]} contentStyle={{ borderRadius: 12, border: "1px solid #e7ebf2" }} />
                      <Area type="monotone" dataKey="customers" stroke="#0d5bd7" strokeWidth={2.5} fill="url(#acqFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Referral Sources</h3>
                <div className="legend"><span className="swatch" style={{ background: "#4f8ef7" }} /> Live mix</div>
              </div>
              <div className="tiny-chart">
                {loading ? (
                  <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
                ) : (
                  <div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
                    {(referrals || []).slice(0, 5).map((source, index) => {
                      const maxValue = Math.max(...(referrals.map((item) => Number(item.clicks || 0))), 1);
                      return (
                        <div key={source.traffic_source || source.source_name || index}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12, color: "#48556a" }}>
                            <span>{source.traffic_source || source.source_name || "Source"}</span>
                            <span>{formatCompact(source.clicks || 0)}</span>
                          </div>
                          <div className="funnel-bar">
                            <div className="funnel-bar-fill" style={{ width: `${Math.min(100, ((source.clicks || 0) / maxValue) * 100)}%`, background: ["#0d5bd7", "#4f8ef7", "#90b8ff", "#6db6d8", "#7ca3ff"][index % 5] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Engagement vs Conversion</h3>
                <div className="legend"><span className="swatch" style={{ background: "#0d5bd7" }} /> Creator</div>
              </div>
              <div className="chart-shell">
                {loading ? (
                  <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#ebeff7" vertical={false} />
                      <XAxis type="number" dataKey="x" name="engagement" unit="%" tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="number" dataKey="y" name="conversion" unit="%" tick={{ fill: "#69778d", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ borderRadius: 12, border: "1px solid #e7ebf2" }} formatter={(value, name) => [Number(value).toFixed(2) + "%", name === "x" ? "Engagement Rate" : "Conversion Rate"]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name || "Creator"} />
                      <Scatter data={scatterData} fill="#0d5bd7" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Conversion Funnel</h3>
                <div className="legend"><span className="swatch" style={{ background: "#4f8ef7" }} /> Drop-off</div>
              </div>
              <div style={{ paddingTop: 8 }}>
                {loading ? (
                  <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
                ) : (
                  <div className="funnel-list">
                    {funnelStages.map((stage, index) => (
                      <div key={stage.label} className="funnel-stage">
                        <div className="funnel-stage-header">
                          <strong>{stage.label}</strong>
                          <span>{formatCompact(stage.value)}</span>
                        </div>
                        <div className="funnel-bar">
                          <div className="funnel-bar-fill" style={{ width: `${Math.min(100, (stage.value / Math.max(...funnelStages.map((item) => item.value), 1)) * 100)}%`, opacity: 0.6 + index * 0.15 }} />
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "#69778d" }}>
                          {index === 0 ? "100.0%" : `${Number(stage.retention || 0).toFixed(1)}% retained`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Top Creators</h3>
                <div className="legend">Ranked by score</div>
              </div>

              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Creator</th>
                      <th className="numeric">Engagement</th>
                      <th className="numeric">CTR</th>
                      <th className="numeric">Conv.</th>
                      <th className="numeric">Revenue</th>
                      <th className="numeric">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(creators || []).slice(0, 6).map((creator, index) => (
                      <tr key={creator.creator_id || creator.creator_name || index}>
                        <td><span className="rank-badge">#{index + 1}</span></td>
                        <td>{creator.creator_name || creator.creator_id || "Creator"}</td>
                        <td className="numeric">{formatPercent(creator.engagement_rate || 0)}</td>
                        <td className="numeric">{formatPercent(creator.ctr || 0)}</td>
                        <td className="numeric">{formatPercent(creator.conversion_rate || 0)}</td>
                        <td className="numeric">{formatCurrency(creator.revenue || creator.total_revenue || 0)}</td>
                        <td className="numeric"><span className="score-pill good">{Number(creator.creator_score || 0).toFixed(1)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Revenue by Creator</h3>
                <div className="legend">Top 5</div>
              </div>
              <div className="tiny-chart">
                {loading ? (
                  <div className="loading-state"><div className="skeleton-row" style={{ width: "100%" }}><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={sortedRevenueData.slice(0, 5)}
                      margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid stroke="#ebeff7" horizontal={false} vertical={true} />
                      <XAxis type="number" tick={{ fill: "#69778d", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#69778d", fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e7ebf2" }} />
                      <Bar dataKey="revenue" fill="#1d865d" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}