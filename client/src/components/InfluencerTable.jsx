import React from "react";
import { Search, ChevronDown } from "lucide-react";

const influencers = [
  {
    name: "Alex Smith",
    platform: "Instagram",
    followers: "1.2M",
    clicks: "45.2K",
    purchases: "3,420",
    revenue: "$120,450",
    repeat: "42%",
    clv: "$898",
    score: 98,
    initials: "AS",
  },
  {
    name: "Jamie Doe",
    platform: "TikTok",
    followers: "850K",
    clicks: "38.1K",
    purchases: "2,858",
    revenue: "$95,200",
    repeat: "38%",
    clv: "$768",
    score: 92,
    initials: "JD",
  },
  {
    name: "Morgan Lee",
    platform: "YouTube",
    followers: "420K",
    clicks: "22.5K",
    purchases: "1,928",
    revenue: "$75,800",
    repeat: "45%",
    clv: "$928",
    score: 88,
    initials: "ML",
  },
  {
    name: "Sam Kim",
    platform: "Instagram",
    followers: "2.5M",
    clicks: "31.8K",
    purchases: "1,568",
    revenue: "$60,000",
    repeat: "30%",
    clv: "$658",
    score: 85,
    initials: "SK",
  },
  {
    name: "Riley Jones",
    platform: "TikTok",
    followers: "500K",
    clicks: "18.8K",
    purchases: "1,180",
    revenue: "$45,500",
    repeat: "35%",
    clv: "$718",
    score: 79,
    initials: "RJ",
  },
];

export default function InfluencerTable() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-800">
          Top Performing Influencers
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={11}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search influencers..."
              className="w-[150px] border border-slate-200 rounded px-2 py-1.5 pl-6 text-[8px] outline-none"
            />
          </div>

          <button className="border border-slate-200 rounded p-1.5">
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f3f6ff]">
            <tr className="text-[7px] text-slate-500">
              <th className="px-3 py-2 font-medium">
                Name
              </th>

              <th className="px-2 py-2 font-medium">
                Platform
              </th>

              <th className="px-2 py-2 font-medium">
                Followers
              </th>

              <th className="px-2 py-2 font-medium">
                Clicks
              </th>

              <th className="px-2 py-2 font-medium">
                Purchases
              </th>

              <th className="px-2 py-2 font-medium">
                Revenue
              </th>

              <th className="px-2 py-2 font-medium">
                Repeat Cust.
              </th>

              <th className="px-2 py-2 font-medium">
                CLV
              </th>

              <th className="px-2 py-2 font-medium">
                Score
              </th>
            </tr>
          </thead>

          <tbody>
            {influencers.map((person) => (
              <tr
                key={person.name}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                {/* Name */}
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

                <td className="px-2 py-2 text-[8px] text-slate-500">
                  {person.platform}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.followers}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.clicks}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.purchases}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.revenue}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.repeat}
                </td>

                <td className="px-2 py-2 text-[8px] text-slate-600">
                  {person.clv}
                </td>

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
                    {person.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-3 py-2 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[8px] text-slate-400">
          Showing 1 to 5 of 124 entries
        </span>

        <div className="flex items-center gap-1">
          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded text-slate-400">
            ‹
          </button>

          <button className="w-5 h-5 text-[8px] bg-blue-600 text-white rounded">
            1
          </button>

          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">
            2
          </button>

          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">
            3
          </button>

          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">
            ...
          </button>

          <button className="w-5 h-5 text-[8px] border border-slate-200 rounded">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}