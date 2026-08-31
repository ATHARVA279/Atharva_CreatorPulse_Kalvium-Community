import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Megaphone,
  Users,
  UserRound,
  Share2,
  DollarSign,
  TrendingUp,
  RefreshCcw,
  Database,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    key: "overview",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/overview",
  },
  {
    key: "campaigns",
    label: "Campaign Analytics",
    icon: Megaphone,
    path: "/campaigns",
  },
  {
    key: "creators",
    label: "Creators",
    icon: Users,
    path: "/creators",
  },
  {
    key: "referrals",
    label: "Referral Tracking",
    icon: Share2,
    path: "/referrals",
  },
  {
    key: "revenue",
    label: "Revenue Analytics",
    icon: DollarSign,
    path: "/revenue",
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 bg-[#eef3ff] border-r border-slate-200 flex-col h-screen sticky top-0 overflow-hidden">

      {/* Logo */}
      <div className="h-20 px-4 flex items-center border-b border-slate-200">
        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <TrendingUp size={16} className="text-white" />
          </div>

          <div>
            <p className="text-[13px] font-bold text-blue-700 leading-none">
              CreatorPulse
            </p>

            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-[0.12em]">
              Campaign Analytics
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 pt-5 flex-1">
        <div className="space-y-1.5">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => onNavigate(item.key)}
                className={() =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-left transition-all duration-200 ${
                    isActive
                      ? "bg-[#d9e7ff] text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`
                }
              >
                <Icon size={15} />

                <span className="leading-tight">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] ${
              isActive
                ? "bg-[#d9e7ff] text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`
          }
        >
          <Settings size={15} />
          <span>Settings</span>
        </NavLink>
      </div>

    </aside>
  );
}