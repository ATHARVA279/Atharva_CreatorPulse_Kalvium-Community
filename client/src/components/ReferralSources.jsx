import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0b56c9", "#f97316", "#64748b", "#14b8a6", "#facc15"];

export default function ReferralSources({ data = [], loading = false }) {
  const pieData = data.length
    ? data.map((item, index) => ({
        name: item.traffic_source || item.source_name || `Source ${index + 1}`,
        value: Number(item.ctr || item.conversion_rate || 0),
      }))
    : [{ name: "No data", value: 100 }];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[195px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-1">Referral Sources</h2>

      <div className="relative h-[125px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[9px] text-slate-500">Loading sources…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={32} outerRadius={48} paddingAngle={2}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[9px] text-slate-500">{loading ? "--" : `${pieData.length} Sources`}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 mt-1">
        {pieData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-medium text-slate-600">{Number(item.value).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}