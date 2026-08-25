import React from "react";

const sidebarItems = [
  { icon: "▦", label: "Dashboard" },
  { icon: "▣", label: "Campaign Analytics", active: true },
  { icon: "♙", label: "Influencers" },
  { icon: "♧", label: "Customers" },
  { icon: "↗", label: "Referral Tracking" },
  { icon: "▤", label: "Revenue Analytics" },
  { icon: "⌁", label: "CLV" },
  { icon: "⌘", label: "Retention Analysis" },
  { icon: "▤", label: "SQL Explorer" },
  { icon: "⚙", label: "Settings" },
];

const campaigns = [
  {
    name: "Q3 Summer Launch",
    spend: "$12,450",
    roi: "245%",
    status: "active",
  },
  {
    name: "Influencer Collab Alpha",
    spend: "$8,200",
    roi: "180%",
    status: "active",
  },
  {
    name: "Retargeting V2",
    spend: "$4,100",
    roi: "95%",
    status: "warning",
  },
  {
    name: "B2B Webinar Promo",
    spend: "$1,850",
    roi: "310%",
    status: "active",
  },
];

function RoiChart() {
  return (
    <div className="relative mt-2 h-[175px] ml-7">

      {/* Y-axis labels */}
      <div className="absolute -left-7 top-1 text-[9px] text-slate-500">
        $50k
      </div>

      <div className="absolute -left-7 top-[73px] text-[9px] text-slate-500">
        $25k
      </div>

      <div className="absolute -left-7 bottom-0 text-[9px] text-slate-500">
        $0
      </div>

      {/* Grid */}
      <div className="absolute left-0 right-0 top-3 border-t border-dashed border-slate-200" />

      <div className="absolute left-0 right-0 top-[85px] border-t border-dashed border-slate-200" />

      <div className="absolute left-0 right-0 bottom-2 border-t border-dashed border-slate-200" />

      {/* SVG Chart */}
      <svg
        className="absolute inset-x-0 top-3 h-[145px] w-full overflow-visible"
        viewBox="0 0 600 180"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="roiGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#155bd3"
              stopOpacity="0.15"
            />

            <stop
              offset="100%"
              stopColor="#155bd3"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Area */}
        <path
          d="
            M0 130
            C45 122 75 128 105 125
            C150 122 170 105 205 83
            C250 54 275 20 325 17
            C370 13 400 25 435 22
            C480 19 520 28 600 12
            L600 180
            L0 180
            Z
          "
          fill="url(#roiGradient)"
        />

        {/* Dashed comparison line */}
        <path
          d="
            M0 145
            C45 139 70 134 110 130
            C150 126 180 115 220 112
            C260 109 290 112 320 111
            C360 110 385 119 420 117
            C460 115 500 118 535 102
            C565 90 585 84 600 76
          "
          fill="none"
          stroke="#667085"
          strokeWidth="6"
          strokeDasharray="12 10"
        />

        {/* Main blue line */}
        <path
          d="
            M0 130
            C45 122 75 128 105 125
            C150 122 170 105 205 83
            C250 54 275 20 325 17
            C370 13 400 25 435 22
            C480 19 520 28 600 12
          "
          fill="none"
          stroke="#0756c9"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      {/* X axis */}
      <div className="absolute bottom-[-1px] left-0 right-0 flex justify-between text-[9px] text-slate-600">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </div>
  );
}

function CpaBreakdown() {
  return (
    <div className="rounded-[9px] border border-slate-300 bg-white p-3">

      <h2 className="text-[14px] font-bold text-slate-800">
        CPA Breakdown
      </h2>

      <div className="mt-7">

        <p className="text-[9px] text-slate-600">
          Blended CPA
        </p>

        <div className="mt-0.5 mb-5 flex items-center justify-between">
          <span className="text-[24px] font-bold leading-none text-slate-800">
            $24.50
          </span>

          <span className="rounded bg-blue-50 px-1.5 py-1 text-[9px] text-blue-600">
            ↘ 12%
          </span>
        </div>

        {/* Social Media */}
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[9px] text-slate-700">
            <span>Social Media</span>
            <span>$18.20</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-[58%] bg-blue-700" />
          </div>
        </div>

        {/* Influencer */}
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[9px] text-slate-700">
            <span>Influencer</span>
            <span>$32.10</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-[78%] bg-blue-700" />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="mb-1 flex justify-between text-[9px] text-slate-700">
            <span>Email</span>
            <span>$12.40</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-[36%] bg-blue-700" />
          </div>
        </div>

      </div>
    </div>
  );
}

function ConversionFunnel() {
  return (
    <div className="rounded-[9px] border border-slate-300 bg-white p-3">

      <h2 className="text-[14px] font-bold text-slate-800">
        Conversion Funnel
      </h2>

      <div className="mt-5 flex flex-col gap-2">

        {/* Clicks */}
        <div className="flex h-7 items-center">
          <div className="w-[78px] pr-3 text-right text-[9px] text-slate-600">
            Clicks
          </div>

          <div className="flex h-7 w-full items-center justify-between rounded bg-blue-100 px-3 text-[11px] text-slate-700">
            <span>125,000</span>
            <span className="text-[8px]">100%</span>
          </div>
        </div>

        {/* Signups */}
        <div className="flex h-7 items-center">
          <div className="w-[78px] pr-3 text-right text-[9px] text-slate-600">
            Signups
          </div>

          <div className="flex h-7 w-[77%] items-center justify-between rounded bg-blue-300 px-3 text-[11px] text-slate-700">
            <span>24,500</span>
            <span className="text-[8px]">19.6%</span>
          </div>
        </div>

        {/* Purchases */}
        <div className="flex h-7 items-center">
          <div className="w-[78px] pr-3 text-right text-[9px] text-slate-600">
            Purchases
          </div>

          <div className="flex h-7 w-[61%] items-center justify-between rounded bg-blue-600 px-3 text-[11px] text-white">
            <span>8,200</span>
            <span className="text-[8px]">6.5%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function ActiveCampaigns() {
  return (
    <div className="overflow-hidden rounded-[9px] border border-slate-300 bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">

        <h2 className="text-[14px] font-bold text-slate-800">
          Active Campaigns
        </h2>

        <button className="text-[9px] text-blue-700">
          View All →
        </button>

      </div>

      {/* Table */}
      <div>

        {/* Table header */}
        <div className="grid grid-cols-[2.4fr_1fr_.7fr_.6fr] items-center border-y border-slate-200 bg-slate-50 px-3 py-1.5 text-[8px] text-slate-500">

          <span>Campaign</span>
          <span className="text-right">Spend</span>
          <span className="text-right">ROI</span>
          <span className="text-right">Status</span>

        </div>

        {/* Rows */}
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className="grid min-h-7 grid-cols-[2.4fr_1fr_.7fr_.6fr] items-center border-b border-slate-200 px-3 text-[9px] text-slate-700 last:border-b-0"
          >

            <span className="truncate">
              {campaign.name}
            </span>

            <span className="text-right">
              {campaign.spend}
            </span>

            <span className="text-right font-semibold text-blue-700">
              {campaign.roi}
            </span>

            <span className="text-right">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  campaign.status === "warning"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}

export default function CampaignAnalytics() {
  return (
    <div className="flex min-h-screen bg-[#f6f8fc] font-sans text-slate-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden w-44 shrink-0 border-r border-[#d5ddec] bg-[#eef3ff] md:block">

        {/* Brand */}
        <div className="flex h-[49px] items-center gap-2 border-b border-[#d5ddec] px-5">

          <div className="relative h-5 w-5">
            <div className="h-5 w-[18px] rounded-sm border border-slate-300 bg-white">
              <div className="ml-1 mt-1 h-[2px] w-2 bg-[#7991bb] shadow-[0_4px_0_#7991bb,0_8px_0_#7991bb]" />
            </div>
          </div>

          <div>
            <div className="text-[15px] font-bold leading-[17px] text-[#0756c9]">
              InfluenceIQ
            </div>

            <div className="text-[8px] text-slate-500">
              SaaS Analytics
            </div>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-[3px] px-2 py-6">

          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 text-[11px] ${
                item.active
                  ? "bg-[#dce6fa] font-semibold text-slate-600"
                  : "text-slate-500 hover:bg-[#e4ebfa]"
              }`}
            >

              <span className="w-3 text-center text-[13px]">
                {item.icon}
              </span>

              <span>{item.label}</span>

            </div>
          ))}

        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <header className="flex h-[49px] items-center justify-between border-b border-[#d5ddec] bg-[#fbfcff] px-5">

          {/* Search */}
          <div className="ml-0 flex h-7 w-80 items-center rounded-full bg-[#f0f4fc] px-3 md:ml-28">

            <span className="mr-2 text-[16px] text-slate-500">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full bg-transparent text-[10px] text-slate-700 outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <button className="text-[16px] text-slate-500">
              ♧
            </button>

            <button className="text-[16px] text-slate-500">
              □
            </button>

            <div className="h-6 w-px bg-slate-300" />

            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm">
              👨🏻
            </div>

          </div>

        </header>

        {/* Content */}
        <section className="flex-1 px-5 py-6">

          {/* Page heading */}
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row">

            <div>
              <h1 className="text-[19px] font-bold leading-6 text-slate-800">
                Campaign Analytics
              </h1>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Overview of active and past marketing initiatives.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button className="h-7 rounded border border-slate-300 bg-white px-3 text-[10px] text-slate-700 hover:bg-slate-50">
                Export CSV
              </button>

              <button className="h-7 rounded border border-blue-600 bg-blue-600 px-3 text-[10px] text-white hover:bg-blue-700">
                New Campaign
              </button>

            </div>

          </div>

          {/* ================= TOP CARDS ================= */}
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[2.15fr_1fr]">

            {/* ROI */}
            <div className="h-[237px] rounded-[9px] border border-slate-300 bg-white p-3">

              <div className="flex items-center justify-between">

                <h2 className="text-[14px] font-bold text-slate-800">
                  ROI Comparison
                </h2>

                <div className="flex gap-0.5 rounded bg-slate-50 p-1">

                  <button className="rounded bg-white px-2 py-1 text-[9px] font-semibold text-slate-700 shadow-sm">
                    30D
                  </button>

                  <button className="px-2 py-1 text-[9px] text-slate-500">
                    90D
                  </button>

                  <button className="px-2 py-1 text-[9px] text-slate-500">
                    1Y
                  </button>

                </div>

              </div>

              <RoiChart />

            </div>

            {/* CPA */}
            <CpaBreakdown />

          </div>

          {/* ================= BOTTOM CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_1fr]">

            <ConversionFunnel />

            <ActiveCampaigns />

          </div>

        </section>

        {/* Footer */}
        <footer className="flex h-6 items-center justify-between border-t border-[#d5ddec] bg-[#f7f9fd] px-5 text-[8px] text-slate-500">

          <span>
            Built with Python • SQL • Pandas • NumPy • Streamlit • GitHub Actions
          </span>

          <div className="hidden gap-5 sm:flex">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>

        </footer>

      </main>
    </div>
  );
}