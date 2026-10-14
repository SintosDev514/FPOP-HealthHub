import React, { useState } from "react";

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
    className="rounded-lg border border-[#1E3A5F]/[0.07] bg-white px-5 py-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(30,58,95,0.14)]"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-[#8a96a3]">
          {title}
        </p>
        <p className="mt-2 text-[20px] font-extrabold leading-none text-[#1E3A5F]">
          {count}
        </p>
        <p className={`mt-3 text-[9px] font-bold ${colors.detail}`}>{detail}</p>
      </div>
      <div
        className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg ${colors.iconBg} ${colors.iconText}`}
      >
        <Icon name={icon} className="h-[22px] w-[22px]" />
      </div>
    </div>
  </article>
  );
};

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[9px] font-bold text-[#1E3A5F]">
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

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const ProfileHeader = ({ profile }) => {
  const name = profile?.name || `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  const schedule = profile?.schedule || {};
  const activeDays = DAY_LABELS.map((label, i) => ({ label, index: i, ...(schedule[i] || schedule[String(i)] || {}) }));

  return (
    <section className="mb-6 overflow-hidden rounded-lg border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
      <div className="flex flex-col gap-5 border-b border-[#1E3A5F]/[0.06] bg-gradient-to-r from-[#1E3A5F] to-[#264a77] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5C518] text-lg font-extrabold text-[#1E3A5F]">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            getInitials(name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-extrabold text-white">{name || "Staff"}</h2>
            {profile?.isAccountVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F5C518]/20 px-2 py-0.5 text-[9px] font-bold text-[#F5C518]">
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
            {profile?.specialty || "Healthcare Staff"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] text-white/80">
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile?.email || "No email"}
            </span>
            {profile?.phone ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile.phone}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-7">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a96a3]">Weekly Schedule</p>
        <div className="flex flex-wrap gap-2">
          {activeDays.map((day) => (
            <div
              key={day.label}
              className={`min-w-[86px] rounded-lg border px-3 py-2 text-center ${
                day.active
                  ? "border-[#15803d]/20 bg-[#dcfce7]"
                  : "border-[#1E3A5F]/[0.08] bg-[#f7fafc]"
              }`}
            >
              <p className={`text-[9px] font-bold uppercase ${day.active ? "text-[#15803d]" : "text-[#8a96a3]"}`}>
                {day.label}
              </p>
              <p className={`mt-1 text-[9px] font-semibold ${day.active ? "text-[#166534]" : "text-[#b0b8c1]"}`}>
                {day.active ? `${formatTime(day.start)} – ${formatTime(day.end)}` : "Off"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const timeToMinutes = (t) => {
  if (!t) return 0;
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

const STATUS_ORDER = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };

const sortAppointments = (list) =>
  [...list].sort((a, b) => {
    const sDiff = (STATUS_ORDER[a.status] ?? 4) - (STATUS_ORDER[b.status] ?? 4);
    if (sDiff !== 0) return sDiff;
    return a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time);
  });

const StaffScheduleView = ({ profile, appointments = [], onRefresh }) => {
  const [updating, setUpdating] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);
  const upcomingApps = appointments.filter(
    (a) => a.date >= todayStr && (a.status === "pending" || a.status === "confirmed")
  );

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`${__API_BASE__}/api/appointments/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        const label = status === "confirmed" ? "accepted" : "declined";
        showFeedback(`Appointment ${label} successfully`, "success");
        if (onRefresh) {
          setTimeout(() => onRefresh(), 500);
        }
      } else {
        showFeedback(data.message || "Failed to update appointment", "error");
      }
    } catch {
      showFeedback("Network error. Please try again.", "error");
    } finally {
      setUpdating(null);
    }
  };

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
      {profile && <ProfileHeader profile={profile} />}
      {feedback && (
        <div
          className={`mb-4 rounded-lg px-5 py-3 text-[10px] font-bold shadow-lg transition-all ${
            feedback.type === "success"
              ? "bg-[#dcfce7] text-[#15803d] border border-[#15803d]/20"
              : "bg-[#fee2e2] text-[#DC2626] border border-[#DC2626]/20"
          }`}
        >
          {feedback.message}
        </div>
      )}
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

      <section className="overflow-hidden rounded-lg border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="w-[265px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Patient Name
                </th>
                <th className="w-[150px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Service
                </th>
                <th className="w-[190px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Time</th>
                <th className="w-[190px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Date</th>
                <th className="w-[150px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Status
                </th>
                <th className="w-[180px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[10px] text-[#8a96a3]">
                    No appointments yet
                  </td>
                </tr>
              ) : (
                sortAppointments(appointments).map((appt) => (
                    <tr
                      key={appt._id}
                      className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1E3A5F]">
                            {appt.patientId?.avatar ? (
                              <img
                                src={appt.patientId.avatar}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "flex"; }}
                              />
                            ) : null}
                            <div
                              className={`flex h-10 w-10 items-center justify-center text-[9px] font-bold text-[#F5C518] ${appt.patientId?.avatar ? "hidden" : "flex"}`}
                            >
                              {getInitials(`${appt.patientId?.firstName || ""} ${appt.patientId?.lastName || ""}`)}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#2d3748]">
                            {appt.patientId?.firstName || "Unknown"} {appt.patientId?.lastName || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <DepartmentBadge>{appt.serviceName || "General"}</DepartmentBadge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-[10px] text-[#5a6475]">
                          <Icon name="clock" className="h-5 w-5 text-[#6B7280]" />
                          <span>{appt.time}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-[10px] text-[#5a6475]">
                          <Icon name="calendar" className="h-5 w-5 text-[#6B7280]" />
                          <span>{appt.date}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${statusStyle(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {appt.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatusChange(appt._id, "confirmed")}
                              disabled={updating === appt._id}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#15803d] px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#166534] disabled:opacity-50"
                            >
                              {updating === appt._id ? "..." : "Accept"}
                            </button>
                            <button
                              onClick={() => handleStatusChange(appt._id, "cancelled")}
                              disabled={updating === appt._id}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#DC2626] px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#B91C1C] disabled:opacity-50"
                            >
                              {updating === appt._id ? "..." : "Decline"}
                            </button>
                          </div>
                        ) : null}
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
