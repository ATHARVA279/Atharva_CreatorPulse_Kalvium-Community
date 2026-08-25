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
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Campaign Analytics",
    icon: Megaphone,
    path: "/campaign-analytics",
  },
  {
    label: "Creators",
    icon: Users,
    path: "/creators",
  },
  {
    label: "Customers",
    icon: UserRound,
    path: "/customers",
  },
  {
    label: "Referral Tracking",
    icon: Share2,
    path: "/referral-tracking",
  },
  {
    label: "Revenue Analytics",
    icon: DollarSign,
    path: "/revenue-analytics",
  },
  {
    label: "CLV",
    icon: TrendingUp,
    path: "/clv",
  },
  {
    label: "Retention Analysis",
    icon: RefreshCcw,
    path: "/retention-analysis",
  },
  {
    label: "SQL Explorer",
    icon: Database,
    path: "/sql-explorer",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[176px] shrink-0 bg-[#eef3ff] border-r border-slate-200 flex-col min-h-screen">

      {/* Logo */}
      <div className="h-16 px-4 flex items-center border-b border-slate-200">
        <div className="flex items-center gap-2">

          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>

          <div>
            <p className="text-[12px] font-bold text-blue-700 leading-none">
              CreatorPulse
            </p>

            <p className="text-[7px] text-slate-400 mt-1">
              Campaign Analytics
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1">
        <div className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[9px] text-left transition ${
                    isActive
                      ? "bg-[#dce7ff] text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-white"
                  }`
                }
              >
                <Icon size={13} />

                <span className="leading-tight">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-slate-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[9px] ${
              isActive
                ? "bg-[#dce7ff] text-blue-700 font-medium"
                : "text-slate-600 hover:bg-white"
            }`
          }
        >
          <Settings size={13} />
          <span>Settings</span>
        </NavLink>
      </div>

    </aside>
  );
}