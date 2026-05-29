import React, { useState } from "react";

const Icon = ({ type, className = "h-5 w-5" }) => {
  const paths = {
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    check: "M5 13l4 4L19 7",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    document:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  );
};

const formatAppointmentDate = (date) => {
  if (!date) return "";
  const value = date instanceof Date ? date : new Date(date);
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const StatCard = ({ icon, label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-[#edf4ff] text-[#244783]",
    green: "bg-[#eafbf1] text-[#00a65a]",
    orange: "bg-[#fff7e6] text-[#f07a00]",
  };

  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${tones[tone]}`}>
          <Icon type={icon} />
        </div>
        <p className="text-3xl font-bold leading-none text-[#061022]">{value}</p>
      </div>
      <p className="mt-5 text-sm font-medium text-[#18304d]">{label}</p>
    </div>
  );
};

const ActionCard = ({ icon, title, subtitle, onClick, accent = "navy" }) => {
  const iconClass = accent === "orange" ? "bg-[#ffae0b] text-white" : "bg-[#244783] text-white";
  const content = (
    <>
      <span className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[14px] ${iconClass}`}>
        <Icon type={icon} className="h-7 w-7" />
      </span>
      <span>
        <span className="block text-lg font-bold text-[#061022]">{title}</span>
        <span className="mt-1 block text-sm text-[#18304d]">{subtitle}</span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[112px] items-center gap-4 rounded-[12px] bg-white px-7 text-left shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex min-h-[112px] items-center gap-4 rounded-[12px] bg-white px-7 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      {content}
    </div>
  );
};

const AppointmentRow = ({ appointment }) => {
  const status = appointment.status || "upcoming";
  const isPending = status === "pending";

  return (
    <div className="rounded-[12px] border border-slate-200 bg-slate-50/40 px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-[#061022]">{appointment.serviceName}</h4>
          <p className="mt-4 flex items-center gap-2 text-sm text-[#18304d]">
            <Icon type="user" className="h-4 w-4" />
            {appointment.doctorName}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-[#18304d]">
            <span className="flex items-center gap-2">
              <Icon type="calendar" className="h-4 w-4" />
              {formatAppointmentDate(appointment.date)}
            </span>
            <span className="flex items-center gap-2">
              <Icon type="clock" className="h-4 w-4" />
              {appointment.time}
            </span>
          </div>
        </div>
        <span
          className={`rounded-[8px] border px-3 py-1 text-xs font-semibold ${
            isPending
              ? "border-amber-300 bg-amber-100 text-[#b45309]"
              : "border-blue-200 bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

const DashboardView = ({
  onBookAppointment,
  onViewAppointments,
  onViewProfile,
  appointments = [],
  profile,
}) => {
  const firstName = profile?.name?.split(" ")[0] || "User";
  const appointmentTotal = appointments.length;
  const [appointmentFilter, setAppointmentFilter] = useState("confirmed");
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState([]);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const notifications = [
    [
      "Appointment Reminder",
      "Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM",
      "2 hours ago",
      true,
    ],
    [
      "Lab Results Available",
      "Your recent lab test results are now available to view",
      "5 hours ago",
      true,
    ],
    [
      "Prescription Ready",
      "Your prescription is ready for pickup at the pharmacy",
      "1 day ago",
      false,
    ],
  ];
  const filteredAppointments = appointments.filter((appointment) => {
    const status = appointment.status || "upcoming";
    if (appointmentFilter === "pending") return status === "pending";
    return status !== "pending";
  });
  const handleNotificationClick = (title, isNew) => {
    setExpandedNotification((current) => (current === title ? null : title));
    if (isNew && !readNotifications.includes(title)) {
      setReadNotifications((current) => [...current, title]);
    }
  };

  return (
    <main className="flex-1 bg-[#f7f8fa] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1234px] space-y-10">
        <section className="relative overflow-hidden rounded-[12px] bg-[#244783] px-10 py-12 text-white shadow-[0_4px_12px_rgba(15,23,42,0.22)]">
          <div className="absolute -right-14 -top-32 h-80 w-80 rounded-full bg-white/8" />
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Welcome Back, {firstName}!
              </h1>
              <p className="mt-3 text-base text-white/95 sm:text-lg">
                Here's what's happening with your healthcare today
              </p>
            </div>
            <div className="hidden h-20 w-20 items-center justify-center rounded-[14px] border border-white/20 bg-white/10 sm:flex">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-[14px] object-cover" />
              ) : (
                <Icon type="user" className="h-11 w-11" />
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="calendar" label="Upcoming" value={appointmentTotal || 2} />
          <StatCard icon="check" label="Completed" value={11} tone="green" />
          <StatCard icon="clock" label="Pending" value={1} tone="orange" />
          <StatCard icon="bell" label="Reminders" value={3} tone="orange" />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ActionCard
            icon="calendar"
            title="Book Appointment"
            subtitle="Schedule a new visit"
            onClick={onBookAppointment}
          />
          <ActionCard
            icon="document"
            title="My Appointments"
            subtitle="View your history"
            onClick={onViewAppointments}
          />
          <ActionCard
            icon="mail"
            title="Verify Email"
            subtitle={otpVerified ? "Email verified" : "Send OTP verification"}
            accent="orange"
            onClick={() => setOtpOpen(true)}
          />
        </section>

        <section className="rounded-[12px] border border-slate-200 bg-white p-8 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#061022]">Upcoming Appointments</h2>
              <p className="mt-1 text-sm text-[#18304d]">Your next scheduled visits</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAppointmentFilter("confirmed")}
                className={`rounded-[8px] border px-5 py-2 text-sm font-semibold ${
                  appointmentFilter === "confirmed"
                    ? "border-[#244783] bg-[#244783] text-white"
                    : "border-slate-200 text-[#061022]"
                }`}
              >
                Confirmed
              </button>
              <button
                type="button"
                onClick={() => setAppointmentFilter("pending")}
                className={`rounded-[8px] border px-5 py-2 text-sm font-semibold ${
                  appointmentFilter === "pending"
                    ? "border-[#ffae0b] bg-[#fff7e6] text-[#f07a00]"
                    : "border-[#ffae0b] text-[#f07a00]"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-[#18304d]">
              No {appointmentFilter} appointments to show.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onBookAppointment}
            className="mt-12 flex w-full items-center justify-center gap-3 rounded-[7px] bg-[#244783] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1c396f]"
          >
            <Icon type="calendar" className="h-5 w-5" />
            Book New Appointment
          </button>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[12px] border border-slate-200 bg-white p-8 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <h2 className="text-2xl font-bold text-[#061022]">Your Profile</h2>
            <div className="mt-12 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-[#244783] text-white">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-[14px] object-cover" />
                ) : (
                  <Icon type="user" className="h-9 w-9" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#061022]">{profile?.name || "Sarah Johnson"}</h3>
                <p className="mt-1 text-sm text-[#18304d]">{profile?.email || "sarah.j@email.com"}</p>
              </div>
            </div>
            <div className="my-8 h-px bg-slate-200" />
            <div className="space-y-8 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#18304d]">Member since</span>
                <strong className="text-[#061022]">Jan 2026</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#18304d]">Total Appointments</span>
                <strong className="text-[#061022]">{Math.max(appointmentTotal, 14)}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onViewProfile}
              className="mt-12 w-full rounded-[8px] border border-slate-200 px-5 py-3 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
            >
              View Full Profile
            </button>
          </div>

          <div className="rounded-[12px] border border-slate-200 bg-white p-8 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <h2 className="text-2xl font-bold text-[#061022]">Recent Notifications</h2>
            <div className="mt-12 space-y-3">
              {notifications.map(([title, body, time, isNew]) => {
                const unread = isNew && !readNotifications.includes(title);
                const expanded = expandedNotification === title;
                return (
                <button
                  type="button"
                  key={title}
                  onClick={() => handleNotificationClick(title, isNew)}
                  className={`w-full rounded-[12px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    unread ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#061022]">{title}</h3>
                      <p className={`mt-4 text-sm text-[#18304d] ${expanded ? "" : "line-clamp-1"}`}>{body}</p>
                      {expanded && (
                        <p className="mt-3 text-xs text-[#496178]">
                          This is a local preview only. Click again to collapse.
                        </p>
                      )}
                      <p className="mt-4 text-xs text-[#496178]">{time}</p>
                    </div>
                    {unread && (
                      <span className="rounded-[8px] bg-[#244783] px-3 py-1 text-xs font-bold text-white">
                        New
                      </span>
                    )}
                  </div>
                </button>
              );
              })}
            </div>
          </div>
        </section>
      </div>
      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#061022]">Verify Email</h2>
                <p className="mt-2 text-sm text-[#18304d]">Enter a mock OTP to preview verification.</p>
              </div>
              <button type="button" className="text-slate-500" onClick={() => setOtpOpen(false)}>
                x
              </button>
            </div>
            <input
              value={otpValue}
              onChange={(event) => setOtpValue(event.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              className="mt-6 h-12 w-full rounded-[8px] border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-[#244783]/30"
            />
            {otpVerified && (
              <p className="mt-3 rounded-[8px] bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                Email verified locally.
              </p>
            )}
            <button
              type="button"
              onClick={() => setOtpVerified(otpValue.trim().length > 0)}
              className="mt-5 w-full rounded-[8px] bg-[#244783] px-4 py-3 text-sm font-bold text-white"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardView;
