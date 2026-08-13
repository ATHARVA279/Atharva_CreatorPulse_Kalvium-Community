import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  {
    name: "Instagram",
    value: 45,
  },
  {
    name: "TikTok",
    value: 35,
  },
  {
    name: "YouTube",
    value: 20,
  },
];

const COLORS = [
  "#0b56c9",
  "#f97316",
  "#64748b",
];

export default function ReferralSources() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[195px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-1">
        Referral Sources
      </h2>

      <div className="relative h-[125px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={48}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[9px] text-slate-500">
              3 Sources
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 mt-1">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-[8px]"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-slate-600">
                {item.name}
              </span>
            </div>

            <span className="font-medium text-slate-600">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}