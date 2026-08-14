import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function RevenueInfluencers({ data = [], loading = false }) {
  const chartData = data.length
    ? data.map((item) => ({
        name: (item.creator_name || item.name || "Creator").slice(0, 12),
        revenue: Number(item.revenue || item.total_revenue || 0),
      }))
    : [{ name: "No data", revenue: 0 }];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[148px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-2">Revenue by Top Creators</h2>

      <div className="h-[105px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[9px] text-slate-500">Loading revenue…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} contentStyle={{ fontSize: "9px" }} />
              <Bar dataKey="revenue" fill="#0756c9" radius={[2, 2, 0, 0]} barSize={17} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}