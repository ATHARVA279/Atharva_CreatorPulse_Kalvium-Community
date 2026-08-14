import React from "react";
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

const stats = [
  {
    title: "Total Influencers",
    value: "1,248",
    change: "+12.5%",
    positive: true,
    icon: Users,
  },
  {
    title: "Active Campaigns",
    value: "42",
    change: "+3",
    positive: true,
    icon: Megaphone,
  },
  {
    title: "Customers Acquired",
    value: "18.5K",
    change: "+8.2%",
    positive: true,
    icon: UserRound,
  },
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: "+15.4%",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Repeat Purchase Rate",
    value: "34.2%",
    change: "-1.2%",
    positive: false,
    icon: RefreshCcw,
  },
  {
    title: "Avg CLV",
    value: "$845",
    change: "+4.1%",
    positive: true,
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Topbar />

          <div className="px-6 py-5">
            {/* Page Heading */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Dashboard Overview
                </h1>

                <p className="text-xs text-slate-500 mt-1">
                  Performance metrics across all active campaigns.
                </p>
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
              <div className="xl:col-span-2">
                <CustomerAcquisitionChart />
              </div>

              <ReferralSources />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
              <RevenueInfluencers />
              <RepeatPurchaseChart />
            </div>

            {/* Influencer Table */}
            <InfluencerTable />
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Built with Python • SQL • Pandas • NumPy • Streamlit • GitHub Actions</span>

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