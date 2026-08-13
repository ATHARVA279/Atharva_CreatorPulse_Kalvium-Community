import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "A. Smith",
    revenue: 120480,
  },
  {
    name: "J. Doe",
    revenue: 95600,
  },
  {
    name: "M. Lee",
    revenue: 75800,
  },
  {
    name: "S. Kim",
    revenue: 60800,
  },
  {
    name: "R. Jones",
    revenue: 45580,
  },
];

export default function RevenueInfluencers() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 h-[148px]">
      <h2 className="text-xs font-semibold text-slate-800 mb-2">
        Revenue by Top Influencers
      </h2>

      <div className="h-[105px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 7,
                fill: "#64748b",
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
              tickLine={false}
            />

            <YAxis hide />

            <Tooltip
              formatter={(value) =>
                `$${value.toLocaleString()}`
              }
              contentStyle={{
                fontSize: "9px",
              }}
            />

            <Bar
              dataKey="revenue"
              fill="#0756c9"
              radius={[2, 2, 0, 0]}
              barSize={17}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}