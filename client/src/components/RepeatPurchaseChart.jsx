import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";

const fallbackData = [
  { month: "Jan", rate: 0 },
  { month: "Feb", rate: 0 },
  { month: "Mar", rate: 0 },
];

export default function RepeatPurchaseChart({ data = [], loading = false }) {
  const chartData = data.length
    ? data.map((item) => ({
        month: item.campaign_id || "Campaign",
        rate: Number(item.conversion_rate || 0),
      }))
    : fallbackData;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[148px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-2">Repeat Purchase Rate Over Time</h2>

      <div className="h-[105px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[9px] text-slate-500">Loading repeat metrics…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="repeatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Area type="monotone" dataKey="rate" stroke="#64748b" strokeWidth={3} fill="url(#repeatGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}