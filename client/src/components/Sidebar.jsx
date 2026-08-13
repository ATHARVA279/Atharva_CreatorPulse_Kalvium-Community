import React from "react";

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
    active: true,
  },
  {
    label: "Campaign Analytics",
    icon: Megaphone,
  },
  {
    label: "Influencers",
    icon: Users,
  },
  {
    label: "Customers",
    icon: UserRound,
  },
  {
    label: "Referral Tracking",
    icon: Share2,
  },
  {
    label: "Revenue Analytics",
    icon: DollarSign,
  },
  {
    label: "CLV",
    icon: TrendingUp,
  },
  {
    label: "Retention Analysis",
    icon: RefreshCcw,
  },
  {
    label: "SQL Explorer",
    icon: Database,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[124px] bg-[#eef3ff] border-r border-slate-200 flex-col min-h-screen">
      {/* Logo */}
      <div className="h-16 px-4 flex items-center border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-blue-700 leading-none">
              InfluenceIQ
            </p>

            <p className="text-[7px] text-slate-400 mt-1">
              SaaS Analytics
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
              <button
                key={item.label}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-[9px] text-left transition ${
                  item.active
                    ? "bg-[#dce7ff] text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                <Icon size={13} />

                <span className="leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-slate-200">
        <button className="w-full flex items-center gap-2 px-2 py-2 text-[9px] text-slate-600">
          <Settings size={13} />
          Settings
        </button>
      </div>
    </aside>
  );
}