import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const fallbackData = [
  { month: "Jan", customers: 0 },
  { month: "Feb", customers: 0 },
  { month: "Mar", customers: 0 },
];

export default function CustomerAcquisitionChart({ data = [], loading = false }) {
  const chartData = data.length
    ? data.map((item) => ({
        month: item.campaign_id || "Campaign",
        customers: Number(item.purchases || 0),
      }))
    : fallbackData;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[195px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-semibold text-slate-800">Customer Acquisition Trend</h2>
        <div className="flex items-center gap-1 text-[8px] text-slate-500">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          {loading ? "Loading" : "New Customers"}
        </div>
      </div>

      <div className="h-[145px] bg-[#f0f3fb] rounded-sm">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[9px] text-slate-500">Loading campaigns…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0756c9" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0756c9" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              />
              <Area type="monotone" dataKey="customers" stroke="#0756c9" strokeWidth={3} fill="url(#customerGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}