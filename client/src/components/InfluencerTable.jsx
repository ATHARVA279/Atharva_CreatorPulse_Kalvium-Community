import React from "react";
import { Search, ChevronDown } from "lucide-react";

export default function InfluencerTable({ data = [], loading = false }) {
  const influencers = data.length
    ? data.map((person) => ({
        name: person.creator_name || person.creator_id || "Unknown",
        platform: person.traffic_source || "Organic",
        clicks: Number(person.total_clicks || person.ctr || 0),
        purchases: Number(person.total_purchases || 0),
        revenue: Number(person.revenue || person.total_revenue || 0),
        repeat: Number(person.repeat_purchase_rate || 0),
        clv: Number(person.purchase_value || 0),
        score: Number(person.creator_score || 0),
        initials: (person.creator_name || "U")
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      }))
    : [];

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-3 flex items-center justify-between border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-800">Top Performing Creators</h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search creators..."
              className="w-[150px] border border-slate-200 rounded px-2 py-1.5 pl-6 text-[8px] outline-none"
            />
          </div>
          <button className="border border-slate-200 rounded p-1.5">
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f3f6ff]">
            <tr className="text-[7px] text-slate-500">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-2 py-2 font-medium">Platform</th>
              <th className="px-2 py-2 font-medium">Clicks</th>
              <th className="px-2 py-2 font-medium">Purchases</th>
              <th className="px-2 py-2 font-medium">Revenue</th>
              <th className="px-2 py-2 font-medium">Repeat Cust.</th>
              <th className="px-2 py-2 font-medium">CLV</th>
              <th className="px-2 py-2 font-medium">Score</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-[8px] text-slate-500 text-center">
                  Loading creators…
                </td>
              </tr>
            ) : influencers.length ? (
              influencers.map((person) => (
                <tr key={person.name} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[6px] font-semibold">
                        {person.initials}
                      </div>
                      <span className="text-[8px] font-medium text-slate-700 whitespace-nowrap">
                        {person.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-2 py-2 text-[8px] text-slate-500">{person.platform}</td>
                  <td className="px-2 py-2 text-[8px] text-slate-600">{person.clicks}</td>
                  <td className="px-2 py-2 text-[8px] text-slate-600">{person.purchases}</td>
                  <td className="px-2 py-2 text-[8px] text-slate-600">${Number(person.revenue).toLocaleString()}</td>
                  <td className="px-2 py-2 text-[8px] text-slate-600">{Number(person.repeat).toFixed(1)}%</td>
                  <td className="px-2 py-2 text-[8px] text-slate-600">${Number(person.clv).toFixed(2)}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[7px] font-semibold ${
                        person.score >= 90
                          ? "bg-green-100 text-green-700"
                          : person.score >= 80
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {Number(person.score).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-[8px] text-slate-500 text-center">
                  No creator data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3 py-2 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[8px] text-slate-400">
          {influencers.length ? `Showing ${Math.min(influencers.length, 5)} entries` : "No entries"}
        </span>
        <div className="flex items-center gap-1">
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded text-slate-400">‹</button>
          <button className="w-5 h-5 text-[8px] bg-blue-600 text-white rounded">1</button>
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">2</button>
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">3</button>
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">...</button>
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">›</button>
        </div>
      </div>
    </div>
  );
}