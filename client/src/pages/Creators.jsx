import { useEffect, useState } from "react";
import { getCreatorRankings } from "../services/api";

const formatCurrency = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `₹${(num / 1000000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString()}`;
};

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

export default function CreatorsPage({ filters = {}, refreshTick = 0 }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCreators() {
      try {
        setLoading(true);
        setError("");
        const data = await getCreatorRankings(filters);
        setCreators(data || []);
      } catch (err) {
        setError(err.message || "Unable to load creators.");
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, [filters, refreshTick]);

  const filteredCreators = creators.filter((creator) => {
    const name = `${creator.creator_name || creator.creator_id || ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Creator Performance</h2>
          <p>Identify creators who consistently convert engagement into customers.</p>
        </div>
        <div className="range-picker" style={{ minWidth: 220 }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search creator"
            style={{ border: "none", outline: "none", background: "transparent", width: "100%", color: "#48556a" }}
          />
        </div>
      </div>

      {error ? (
        <div className="empty-state"><strong>Creator data unavailable.</strong><span>{error}</span></div>
      ) : (
        <div className="panel">
          <div className="panel-header"><h3>Creator ranking</h3></div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Creator</th>
                  <th className="numeric">Campaigns</th>
                  <th className="numeric">Engagement</th>
                  <th className="numeric">CTR</th>
                  <th className="numeric">Conversion</th>
                  <th className="numeric">Purchases</th>
                  <th className="numeric">Revenue</th>
                  <th className="numeric">Score</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding: "24px", textAlign: "center", color: "#69778d" }}>Loading creators…</td></tr>
                ) : filteredCreators.length ? (
                  filteredCreators.map((creator, index) => (
                    <tr key={creator.creator_id || creator.creator_name || index}>
                      <td>{creator.creator_name || creator.creator_id}</td>
                      <td className="numeric">{Number(creator.campaign_count || 0)}</td>
                      <td className="numeric">{formatPercent(creator.engagement_rate || 0)}</td>
                      <td className="numeric">{formatPercent(creator.ctr || 0)}</td>
                      <td className="numeric">{formatPercent(creator.conversion_rate || 0)}</td>
                      <td className="numeric">{Number(creator.total_purchases || 0).toLocaleString()}</td>
                      <td className="numeric">{formatCurrency(creator.revenue || creator.total_revenue || 0)}</td>
                      <td className="numeric"><span className="score-pill good">{Number(creator.creator_score || 0).toFixed(1)}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={8} style={{ padding: "24px", textAlign: "center", color: "#69778d" }}>No creators match the current filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
