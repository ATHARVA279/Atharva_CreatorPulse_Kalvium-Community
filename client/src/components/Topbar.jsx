import React from "react";
import { CalendarRange, Download, RefreshCcw } from "lucide-react";

const RANGE_OPTIONS = [
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "this_quarter", label: "This quarter" },
];

export default function Topbar({ title, dateRange, onDateRangeChange, onRefresh, onExport }) {
  return (
    <header className="topbar">
      <div>
        <p className="breadcrumb">Overview</p>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <label className="range-picker">
          <CalendarRange size={14} />
          <select value={dateRange} onChange={(event) => onDateRangeChange(event.target.value)}>
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="toolbar-button secondary" onClick={onRefresh}>
          <RefreshCcw size={14} />
          Refresh
        </button>

        <button type="button" className="toolbar-button primary" onClick={onExport}>
          <Download size={14} />
          Export
        </button>
      </div>
    </header>
  );
}