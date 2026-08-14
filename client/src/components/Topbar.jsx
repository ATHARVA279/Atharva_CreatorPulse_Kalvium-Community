import React from "react";
import {
  Search,
  Bell,
  CalendarDays,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5">
      {/* Search */}
      <div className="relative w-[220px]">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search analytics..."
          className="w-full bg-[#f1f5ff] rounded-md pl-8 pr-3 py-2 text-[10px] outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell
          size={15}
          className="text-slate-500 cursor-pointer"
        />

        <CalendarDays
          size={15}
          className="text-slate-500 cursor-pointer"
        />

        <div className="w-7 h-7 rounded-full bg-slate-300 overflow-hidden">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}