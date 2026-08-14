import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import CustomerAcquisitionChart from "../components/CustomerAcquisitionChart";
import ReferralSources from "../components/ReferralSources";
import RevenueInfluencers from "../components/RevenueInfluencers";
import RepeatPurchaseChart from "../components/RepeatPurchaseChart";
import InfluencerTable from "../components/InfluencerTable";

import {
  Users,
  Megaphone,
  UserRound,
  DollarSign,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import { getCampaigns, getDashboardSummary, getCreatorRankings, getReferralSources } from "../services/api";

const statConfig = [
  { title: "Total Creators", key: "total_creators", icon: Users },
  { title: "Active Campaigns", key: "total_campaigns", icon: Megaphone },
  { title: "Customers Acquired", key: "total_purchases", icon: UserRound },
  { title: "Total Revenue", key: "total_attributed_revenue", icon: DollarSign, formatter: (value) => `$${Number(value).toLocaleString()}` },
  { title: "Conversion Rate", key: "overall_conversion_rate", icon: RefreshCcw, formatter: (value) => `${Number(value).toFixed(2)}%` },
  { title: "Referral Clicks", key: "total_referral_clicks", icon: TrendingUp },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [referralSources, setReferralSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");
        const [summaryData, creatorsData, campaignsData, referralData] = await Promise.all([
          getDashboardSummary(),
          getCreatorRankings(),
          getCampaigns(),
          getReferralSources(),
        ]);

        setSummary(summaryData);
        setCreators(creatorsData || []);
        setCampaigns(campaignsData || []);
        setReferralSources(referralData || []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    if (!summary) return statConfig.map((item) => ({ ...item, value: "--", change: "Loading...", positive: true, loading: true }));

    return statConfig.map((item) => {
      const raw = summary[item.key] ?? 0;
      const value = item.formatter ? item.formatter(raw) : new Intl.NumberFormat().format(raw);
      return {
        title: item.title,
        value,
        change: item.key === "overall_conversion_rate" ? "Live KPI" : "Updated",
        positive: true,
        icon: item.icon,
        loading: false,
      };
    });
  }, [summary]);

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <Topbar />

          <div className="px-6 py-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Dashboard Overview</h1>
                <p className="text-xs text-slate-500 mt-1">Performance metrics across all active campaigns.</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  <span>▣</span>
                  Last 30 Days
                </button>

                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-xs font-medium">
                  ↓ Export
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
              <div className="xl:col-span-2">
                <CustomerAcquisitionChart data={campaigns} loading={loading} />
              </div>

              <ReferralSources data={referralSources} loading={loading} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
              <RevenueInfluencers data={creators.slice(0, 5)} loading={loading} />
              <RepeatPurchaseChart data={campaigns} loading={loading} />
            </div>

            <InfluencerTable data={creators} loading={loading} />
          </div>

          <footer className="border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Built with Python • SQL • Pandas • NumPy • FastAPI • GitHub Actions</span>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}