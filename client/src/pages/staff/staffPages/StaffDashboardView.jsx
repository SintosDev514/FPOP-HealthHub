import React, { useState } from "react";


const Ico = ({ d, className = "h-4 w-4" }) => (
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
    <path d={d} />
  </svg>
);

const ICONS = {
  calendar:
    "M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  users:
    "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.2.5 4 2 4 4v1M8 11c-2.2.5-4 2-4 4v1",
  trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
  check: "m8 12 3 3 6-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  clock: "M12 6v6l4 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  plus: "M12 4v16m8-8H4",
  pulse: "M4 12h3l2-7 4 14 2-7h5",
  chevRight: "m9 18 6-6-6-6",
  chevLeft: "m15 18-6-6 6-6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
};


const palette = {
  navy: { bg: "bg-[#e8edf5]", txt: "text-[#1E3A5F]", num: "text-[#1E3A5F]" },
  green: { bg: "bg-[#dcfce7]", txt: "text-[#16a34a]", num: "text-[#15803d]" },
  gold: { bg: "bg-[#fef9c3]", txt: "text-[#ca8a04]", num: "text-[#a16207]" },
  orange: { bg: "bg-[#ffedd5]", txt: "text-[#ea580c]", num: "text-[#c2410c]" },
};

const StatCard = ({ title, value, sub, icon, tone = "navy" }) => {
  const c = palette[tone];
  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* three-dot menu */}
      <button
        type="button"
        className="absolute right-3 top-3 rounded-full p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-500"
        aria-label="Options"
      >
        <Ico d={ICONS.dots} className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.txt}`}>
          <Ico d={ICONS[icon]} className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className={`text-xl font-extrabold leading-tight ${c.num}`}>{value}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] font-medium text-slate-400">{sub}</p>
    </article>
  );
};


const DonutChart = ({ data }) => {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const slice = { ...d, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
          {slices.map((s, i) => (
            <circle
              key={i}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
            />
          ))}
          {/* white ring center */}
          <circle cx="60" cy="60" r="35" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-[#1E3A5F]">{total}</span>
          <span className="text-[10px] text-slate-400">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.label}
            <span className="font-bold text-slate-800">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const MiniCalendar = ({ appointments }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const apptDates = new Set(
    appointments.map((a) => {
      const d = new Date(a.date);
      if (d.getMonth() === month && d.getFullYear() === year) return d.getDate();
      return null;
    }).filter(Boolean)
  );

  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* month nav */}
      <div className="mb-3 flex items-center justify-between gap-1">
        <button onClick={prev} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
          <Ico d={ICONS.chevLeft} className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          <span className="text-sm font-bold text-[#1E3A5F]">{monthName} {year}</span>
          {(month !== today.getMonth() || year !== today.getFullYear()) && (
            <button
              onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
              className="rounded-md bg-[#1E3A5F]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1E3A5F] transition hover:bg-[#1E3A5F]/20"
            >
              Today
            </button>
          )}
        </div>
        <button onClick={next} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
          <Ico d={ICONS.chevRight} className="h-4 w-4" />
        </button>
      </div>


      {/* day headers */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <span key={d} className="text-[10px] font-bold uppercase text-slate-400">{d}</span>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasAppt = apptDates.has(d);
          return (
            <span
              key={i}
              className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold
                ${isToday ? "bg-[#1E3A5F] text-white" : "text-slate-600 hover:bg-slate-100"}
              `}
            >
              {d}
              {hasAppt && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F5C518]" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────── appointment row ─────────────────── */
const statusStyle = {
  completed: "bg-green-50 text-green-600",
  pending: "bg-amber-50  text-amber-600",
  confirmed: "bg-sky-50    text-sky-600",
  cancelled: "bg-red-50    text-red-500",
};

const ApptRow = ({ appt }) => {
  const name = `${appt.patientId?.firstName || "–"} ${appt.patientId?.lastName || ""}`.trim();
  const badge = statusStyle[appt.status] || "bg-slate-100 text-slate-500";
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50">
      {/* avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-[11px] font-bold uppercase text-[#1E3A5F]">
        {name.charAt(0) || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-700">{name}</p>
        <p className="truncate text-[11px] text-slate-400">{appt.serviceName || "General"}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] font-semibold text-slate-500">{appt.date}</p>
        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${badge}`}>
          {appt.status}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────── activity feed item ─────────────────── */
const activityMeta = (appt) => {
  const time = new Date(appt.createdAt || appt.date);
  const diff = Date.now() - time.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const ActivityFeed = ({ appointments }) => {
  const items = [...appointments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  const dotColor = { completed: "#22c55e", pending: "#f59e0b", confirmed: "#3b82f6", cancelled: "#ef4444" };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-400">No recent activity</p>
      ) : (
        items.map((a) => (
          <div key={a._id} className="flex items-start gap-3">
            <div
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: dotColor[a.status] || "#94a3b8" }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-slate-700">
                {a.serviceName || "Appointment"}
              </p>
              <p className="text-[10px] text-slate-400">
                {`${a.patientId?.firstName || ""} ${a.patientId?.lastName || ""}`.trim() || "Patient"} · {activityMeta(a)}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize ${statusStyle[a.status] || "bg-slate-100 text-slate-500"}`}>
              {a.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

/* ─────────────────── main component ─────────────────── */
const StaffDashboardView = ({ profile, appointments = [], onStartAssessment }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const upcomingCount = appointments.filter(
    (a) => (a.status === "pending" || a.status === "confirmed") && a.date >= todayStr
  ).length;

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const donutData = [
    { label: "Completed", value: completedCount, color: "#22c55e" },
    { label: "Pending", value: pendingCount, color: "#f59e0b" },
    { label: "Today", value: todayCount, color: "#3b82f6" },
  ];

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() ||
    profile.name?.[0]?.toUpperCase() || "S"
    : "S";

  return (
    <main className="flex-1 min-h-0 bg-[#f1f4f8] p-5 lg:p-6">

      {/* ── header ── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Dashboard Overview</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            {profile ? `Welcome back, ${profile.firstName || profile.name}!` : "Welcome back!"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onStartAssessment}
            className="flex items-center gap-1.5 rounded-lg bg-[#F5C518] px-4 py-2 text-xs font-bold text-[#1E3A5F] shadow shadow-[#F5C518]/30 transition hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Ico d={ICONS.plus} className="h-3.5 w-3.5" />
            New Client Assessment
          </button>

        </div>
      </div>

      {/* ── stat cards ── */}
      <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          sub={`${upcomingCount} upcoming`}
          icon="calendar"
          tone="navy"
        />
        <StatCard
          title="Today"
          value={todayCount}
          sub={todayCount === 1 ? "1 appointment" : `${todayCount} appointments`}
          icon="trend"
          tone="green"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          sub="Awaiting confirmation"
          icon="users"
          tone="gold"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          sub="Successfully done"
          icon="check"
          tone="orange"
        />
      </section>

      {/* ── middle row: Recent Appointments + Quick Stats ── */}
      <section className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">

        {/* recent appointments */}
        <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1E3A5F]">Recent Appointments</h3>
            <button className="text-[11px] font-semibold text-[#1E3A5F]/60 hover:text-[#1E3A5F]">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {recentAppointments.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">No appointments yet.</p>
            ) : (
              recentAppointments.map((a) => <ApptRow key={a._id} appt={a} />)
            )}
          </div>
        </article>

        {/* quick stats */}
        <article className="rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#152c4a] p-5 text-white shadow-sm">
          <h3 className="mb-4 text-sm font-extrabold">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { label: "Today's Appointments", value: todayCount, max: Math.max(todayCount, 10), color: "#3b82f6" },
              { label: "Pending", value: pendingCount, max: Math.max(pendingCount, 10), color: "#f59e0b" },
              { label: "Completed", value: completedCount, max: Math.max(completedCount, appointments.length, 1), color: "#22c55e" },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white/80">{label}</span>
                  <span className="font-extrabold">{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-white/10 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Completion rate
            </p>
            <p className="mt-0.5 text-2xl font-extrabold">
              {appointments.length > 0
                ? `${Math.round((completedCount / appointments.length) * 100)}%`
                : "0%"}
            </p>
          </div>
        </article>
      </section>

      {/* ── bottom row: Calendar · Donut Chart · Activity Feed ── */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        {/* upcoming schedule / mini calendar */}
        <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Ico d={ICONS.calendar} className="h-4 w-4 text-[#1E3A5F]" />
            <h3 className="text-sm font-extrabold text-[#1E3A5F]">Upcoming Schedule</h3>
          </div>
          <MiniCalendar appointments={appointments} />

          {/* today's appts below calendar */}
          {todayCount > 0 && (
            <div className="mt-4 rounded-lg bg-[#f1f4f8] px-3 py-2">
              <p className="text-[11px] font-bold text-[#1E3A5F]">
                {todayCount} appointment{todayCount > 1 ? "s" : ""} today
              </p>
            </div>
          )}
        </article>

        {/* appointment overview donut */}
        <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Ico d={ICONS.pulse} className="h-4 w-4 text-[#1E3A5F]" />
            <h3 className="text-sm font-extrabold text-[#1E3A5F]">Appointment Overview</h3>
          </div>
          <DonutChart data={donutData} />
        </article>

        {/* recent activity feed */}
        <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-2 xl:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ico d={ICONS.activity} className="h-4 w-4 text-[#1E3A5F]" />
              <h3 className="text-sm font-extrabold text-[#1E3A5F]">Recent Activity</h3>
            </div>
            <button className="text-[11px] font-semibold text-[#1E3A5F]/60 hover:text-[#1E3A5F]">
              View all
            </button>
          </div>
          <ActivityFeed appointments={appointments} />
        </article>
      </section>
    </main>
  );
};

export default StaffDashboardView;
