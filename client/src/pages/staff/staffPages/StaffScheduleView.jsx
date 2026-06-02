import React from "react";

const Icon = ({ name, className = "h-6 w-6" }) => {
  const paths = {
    sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.64 5.64 4.22 4.22M19.78 19.78l-1.42-1.42M5.64 18.36l-1.42 1.42M19.78 4.22l-1.42 1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    sunset:
      "M12 4v6M8 10l-2-2M16 10l2-2M4 16h16M7 20h10M9 13a3 3 0 0 1 6 0",
    moon: "M20 14.5A7.5 7.5 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z",
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    calendar:
      "M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
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
  orange: {
    iconBg: "bg-[#ffedd5]",
    iconText: "text-[#ea580c]",
    detail: "text-[#ea580c]",
  },
};

const ShiftCard = ({ title, count, detail, icon, tone = "navy" }) => {
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
          {count}
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

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-xs font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
};

const StaffScheduleView = ({ appointments = [] }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);
  const upcomingApps = appointments.filter(
    (a) => a.date >= todayStr && (a.status === "pending" || a.status === "confirmed")
  );

  const statusStyle = (status) => {
    const styles = {
      pending: "bg-[#ffedd5] text-[#ea580c]",
      confirmed: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      completed: "bg-[#dcfce7] text-[#15803d]",
      cancelled: "bg-slate-100 text-slate-500",
    };
    return styles[status] || styles.pending;
  };

  return (
    <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ShiftCard
          title="Today's Appointments"
          count={todayApps.length}
          detail={todayApps.length === 1 ? "1 appointment" : `${todayApps.length} appointments`}
          icon="sun"
          tone="gold"
        />
        <ShiftCard
          title="Upcoming"
          count={upcomingApps.length}
          detail={upcomingApps.length === 1 ? "1 upcoming" : `${upcomingApps.length} upcoming`}
          icon="sunset"
          tone="orange"
        />
        <ShiftCard
          title="Total Appointments"
          count={appointments.length}
          detail="All time"
          icon="moon"
          tone="navy"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="w-[265px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                  Patient Name
                </th>
                <th className="w-[150px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                  Service
                </th>
                <th className="w-[190px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">Time</th>
                <th className="w-[190px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">Date</th>
                <th className="w-[150px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#8a96a3]">
                    No appointments yet
                  </td>
                </tr>
              ) : (
                [...appointments]
                  .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                  .map((appt) => (
                    <tr
                      key={appt._id}
                      className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F] text-sm font-bold text-[#F5C518]">
                            {getInitials(`${appt.patientId?.firstName || ""} ${appt.patientId?.lastName || ""}`)}
                          </div>
                          <span className="text-sm font-bold text-[#2d3748]">
                            {appt.patientId?.firstName || "Unknown"} {appt.patientId?.lastName || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <DepartmentBadge>{appt.serviceName || "General"}</DepartmentBadge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-sm text-[#5a6475]">
                          <Icon name="clock" className="h-5 w-5 text-[#6B7280]" />
                          <span>{appt.time}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-sm text-[#5a6475]">
                          <Icon name="calendar" className="h-5 w-5 text-[#6B7280]" />
                          <span>{appt.date}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusStyle(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default StaffScheduleView;
