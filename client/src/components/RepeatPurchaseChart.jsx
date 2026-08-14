import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", rate: 21 },
  { month: "Feb", rate: 24 },
  { month: "Mar", rate: 28 },
  { month: "Apr", rate: 35 },
  { month: "May", rate: 39 },
  { month: "Jun", rate: 37 },
  { month: "Jul", rate: 34 },
];

export default function RepeatPurchaseChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[148px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-2">
        Repeat Purchase Rate Over Time
      </h2>

      <div className="h-[105px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="repeatGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#64748b"
                  stopOpacity={0.15}
                />

                <stop
                  offset="100%"
                  stopColor="#64748b"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis dataKey="month" hide />

            <YAxis hide />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="#64748b"
              strokeWidth={3}
              fill="url(#repeatGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}