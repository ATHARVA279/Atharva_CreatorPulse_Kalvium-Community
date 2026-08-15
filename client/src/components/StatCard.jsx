import React from "react";

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  loading = false,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 min-h-[82px]">
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-slate-500">{title}</p>
        <Icon size={13} className="text-blue-600" />
      </div>

      <p className="text-lg font-semibold text-slate-900 mt-2">
        {loading ? "--" : value}
      </p>

      <p className={`text-[8px] mt-1 ${positive ? "text-green-500" : "text-red-400"}`}>
        {loading ? "Loading..." : change}
      </p>
    </div>
  );
}