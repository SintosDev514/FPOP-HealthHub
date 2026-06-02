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

const statTones = {
  navy: {
    iconBg: "bg-[#1E3A5F]/10",
    iconText: "text-[#1E3A5F]",
    detail: "text-[#22c55e]",
  },
  gold: {
    iconBg: "bg-[#F5C518]/20",
    iconText: "text-[#B88900]",
    detail: "text-[#B88900]",
  },
  green: {
    iconBg: "bg-[#dcfce7]",
    iconText: "text-[#22c55e]",
    detail: "text-[#22c55e]",
  },
  orange: {
    iconBg: "bg-[#ffedd5]",
    iconText: "text-[#ea580c]",
    detail: "text-[#ea580c]",
  },
};

const StatCard = ({ title, value, detail, icon, tone = "navy" }) => {
  const colors = statTones[tone] || statTones.navy;

  return (
  <article
    className="rounded-2xl border border-[#1E3A5F]/[0.07] bg-white px-5 py-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(30,58,95,0.14)]"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a96a3]">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold leading-none text-[#1E3A5F]">
          {value}
        </p>
        <p className={`mt-3 text-xs font-bold ${colors.detail}`}>{detail}</p>
      </div>
      <div
        className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconText}`}
      >
        <Icon name={icon} className="h-[22px] w-[22px]" />
      </div>
    </div>
  </article>
  );
};

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

const StaffDashboardView = ({ profile, stats = {}, appointments = [] }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const upcomingCount = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
      <section className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold leading-tight text-[#1E3A5F]">
            Dashboard Overview
          </h2>
          <p className="mt-1.5 text-sm font-medium text-[#8a96a3]">
            {profile ? `Welcome back, ${profile.name}!` : "Welcome back!"}
          </p>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          detail={`${upcomingCount} upcoming`}
          icon="calendar"
          tone="navy"
        />
        <StatCard
          title="Today"
          value={todayCount}
          detail={todayCount === 1 ? "1 appointment" : `${todayCount} appointments`}
          icon="trend"
          tone="green"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          detail="Awaiting confirmation"
          icon="users"
          tone="gold"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          detail="Successfully done"
          icon="file"
          tone="orange"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.8fr)]">
        <article className="rounded-xl bg-white p-7 shadow-sm">
          <div className="mb-8 flex items-center gap-4">
            <Icon name="pulse" className="h-8 w-8 text-[#3B5FDB]" />
            <h3 className="text-3xl font-bold text-black">Recent Appointments</h3>
          </div>

          <div className="space-y-5">
            {recentAppointments.length === 0 ? (
              <p className="text-base text-[#8a96a3]">No appointments yet.</p>
            ) : (
              recentAppointments.map((appt) => (
                <ActivityItem
                  key={appt._id}
                  icon={appt.status === "completed" ? "check" : "calendar"}
                  title={appt.serviceName || "Appointment"}
                  meta={`${appt.patientId?.firstName || ""} ${appt.patientId?.lastName || ""} - ${appt.date} ${appt.time} - ${formatTimeAgo(appt.createdAt)}`}
                  tone={appt.status === "completed" ? "green" : appt.status === "pending" ? "yellow" : "blue"}
                />
              ))
            )}
          </div>
        </article>

        <aside className="space-y-8">
          <article className="rounded-xl bg-gradient-to-br from-[#435B9C] to-[#1E3A5F] p-8 text-white shadow-sm">
            <div className="mb-10 flex items-center gap-4">
              <Icon name="ribbon" className="h-8 w-8" />
              <h3 className="text-3xl font-bold">Quick Stats</h3>
            </div>
            <div className="space-y-9">
              <QuickStat icon="calendar" label="Today's Appointments" value={todayCount} progress={Math.min(todayCount * 20, 100)} />
              <QuickStat icon="users" label="Pending" value={pendingCount} progress={Math.min(pendingCount * 25, 100)} />
              <QuickStat icon="trend" label="Completed" value={completedCount} progress={appointments.length > 0 ? Math.round((completedCount / appointments.length) * 100) : 0} />
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
};

export default StaffDashboardView;
