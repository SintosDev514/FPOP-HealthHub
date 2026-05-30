import React from "react";

const Icon = ({ name, className = "h-7 w-7" }) => {
  const paths = {
    users:
      "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.2.5 4 2 4 4v1M8 11c-2.2.5-4 2-4 4v1",
    trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
    calendar:
      "M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6M9 17h6",
    pulse: "M4 12h3l2-7 4 14 2-7h5",
    check: "m8 12 3 3 6-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    ribbon: "M8 4h8v16l-4-2.5L8 20V4Z",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

const StatCard = ({ title, value, detail, icon, className }) => (
  <article
    className={`relative min-h-[195px] overflow-hidden rounded-md p-5 text-white shadow-md transition hover:-translate-y-0.5 ${className}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-base font-semibold text-white/90">{title}</p>
        <p className="mt-4 text-6xl font-bold leading-none">{value}</p>
      </div>
      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-white/20">
        <Icon name={icon} />
      </div>
    </div>
    <p className="mt-4 text-sm font-medium text-white/90">{detail}</p>
    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white/20" />
  </article>
);

const ActivityItem = ({ icon, title, meta, tone }) => {
  const tones = {
    green: "bg-green-100 text-green-500",
    blue: "bg-blue-100 text-sky-500",
    yellow: "bg-[#FFF6CE] text-[#C59A00]",
  };

  return (
    <div className="flex items-center gap-5 rounded-lg border border-slate-200 bg-white px-5 py-5">
      <div
        className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${tones[tone]}`}
      >
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <h4 className="truncate text-xl font-bold text-black">{title}</h4>
        <p className="mt-1 text-base text-[#4B5563]">{meta}</p>
      </div>
    </div>
  );
};

const QuickStat = ({ icon, label, value, progress }) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-3">
        <Icon name={icon} className="h-6 w-6 shrink-0" />
        <span className="truncate text-lg font-semibold">{label}</span>
      </div>
      <span className="text-3xl font-bold">{value}</span>
    </div>
    <div className="h-[7px] rounded-full bg-white/25">
      <div
        className="h-full rounded-full bg-white"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const StaffDashboardView = ({ stats = {} }) => {
  const dashboardStats = {
    totalStaff: 248,
    activeToday: 186,
    appointments: 42,
    pendingReports: 8,
    ...stats,
  };

  return (
    <main className="flex-1 px-4 py-8 sm:px-8 lg:px-[60px]">
      <section className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-4xl font-bold leading-tight text-[#1E3A5F] sm:text-[44px]">
            Dashboard Overview
          </h2>
          <p className="mt-3 text-xl text-[#4B5563]">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-black">
        
        </div>
      </section>

      <section className="mb-2 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Staff"
          value={dashboardStats.totalStaff}
          detail="+12 this month"
          icon="users"
          className="bg-gradient-to-br from-[#435B9C] to-[#1E3A5F]"
        />
        <StatCard
          title="Active Today"
          value={dashboardStats.activeToday}
          detail="75% attendance"
          icon="trend"
          className="bg-gradient-to-br from-[#F5C518] to-[#D9A900]"
        />
        <StatCard
          title="Appointments"
          value={dashboardStats.appointments}
          detail="8 pending"
          icon="calendar"
          className="bg-gradient-to-br from-[#3B82F6] to-[#06B6D4]"
        />
        <StatCard
          title="Reports Pending"
          value={dashboardStats.pendingReports}
          detail="3 urgent"
          icon="file"
          className="bg-gradient-to-br from-[#34D399] to-[#10B981]"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.8fr)]">
        <article className="rounded-xl bg-white p-7 shadow-sm">
          <div className="mb-8 flex items-center gap-4">
            <Icon name="pulse" className="h-8 w-8 text-[#3B5FDB]" />
            <h3 className="text-3xl font-bold text-black">Recent Activity</h3>
          </div>

          <div className="space-y-5">
            <ActivityItem
              icon="check"
              title="New staff member registered"
              meta="Patricia Garcia - 2 hours ago"
              tone="green"
            />
            <ActivityItem
              icon="file"
              title="Report submitted"
              meta="Dr. Michael Chen - 4 hours ago"
              tone="blue"
            />
            <ActivityItem
              icon="calendar"
              title="Schedule updated"
              meta="Nursing Team - 6 hours ago"
              tone="yellow"
            />
          </div>
        </article>

        <aside className="space-y-8">
          <article className="rounded-xl bg-gradient-to-br from-[#435B9C] to-[#1E3A5F] p-8 text-white shadow-sm">
            <div className="mb-10 flex items-center gap-4">
              <Icon name="ribbon" className="h-8 w-8" />
              <h3 className="text-3xl font-bold">Quick Stats</h3>
            </div>
            <div className="space-y-9">
              <QuickStat icon="users" label="Staff on Leave" value="12" progress={5} />
              <QuickStat icon="ribbon" label="Departments" value="8" progress={100} />
              <QuickStat icon="trend" label="New This Month" value="5" progress={25} />
            </div>
          </article>

        </aside>
      </section>
    </main>
  );
};

export default StaffDashboardView;
