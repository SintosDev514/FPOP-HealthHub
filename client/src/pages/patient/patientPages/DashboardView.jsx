import React, { useState, useEffect } from "react";

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
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={paths[type]}
      />
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

const getAppointmentStatus = (appointment) => appointment.status || "upcoming";

const getAppointmentStats = (appointmentList = []) =>
  appointmentList.reduce(
    (stats, appointment) => {
      const status = getAppointmentStatus(appointment);
      return {
        ...stats,
        total: stats.total + 1,
        upcoming: stats.upcoming + (status === "upcoming" ? 1 : 0),
        completed: stats.completed + (status === "completed" ? 1 : 0),
        pending: stats.pending + (status === "pending" ? 1 : 0),
      };
    },
    { total: 0, upcoming: 0, completed: 0, pending: 0 },
  );

const StatCard = ({ icon, label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-[#edf4ff] text-[#244783]",
    green: "bg-[#eafbf1] text-[#00a65a]",
    orange: "bg-[#fff7e6] text-[#f07a00]",
  };

  return (
    <div className="min-w-0 rounded-[8px] border border-slate-100 bg-white p-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:min-h-0 md:rounded-[12px] md:p-4 md:shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex min-w-0 items-center gap-2.5 md:block">
        <div className="contents md:flex md:items-start md:justify-between">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] md:h-10 md:w-10 md:rounded-[10px] ${tones[tone]}`}
          >
            <Icon type={icon} className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
          <p className="order-3 mt-0 text-lg font-bold leading-none text-[#061022] md:order-none md:mt-0 md:text-2xl">
            {value}
          </p>
        </div>
        <p className="order-2 mt-0 min-w-0 flex-1 truncate text-[10px] font-semibold leading-tight text-[#18304d] md:mt-3 md:w-full md:text-xs md:font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};

const ActionCard = ({
  icon,
  title,
  subtitle,
  onClick,
  accent = "navy",
  mobileStacked = false,
}) => {
  const iconClass =
    accent === "orange" ? "bg-[#ffae0b] text-white" : "bg-[#244783] text-white";
  const actionClass = mobileStacked
    ? "flex min-h-[124px] w-full min-w-0 max-w-full flex-col items-start justify-center gap-3 rounded-[12px] bg-white px-4 text-left shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md md:min-h-[88px] md:flex-row md:items-center md:justify-start md:px-5"
    : "flex min-h-[88px] items-center gap-3 rounded-[12px] bg-white px-5 text-left shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md";
  const staticClass = mobileStacked
    ? "flex min-h-[124px] w-full min-w-0 max-w-full flex-col items-start justify-center gap-3 rounded-[12px] bg-white px-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)] md:min-h-[88px] md:flex-row md:items-center md:justify-start md:px-5"
    : "flex min-h-[88px] items-center gap-3 rounded-[12px] bg-white px-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]";
  const content = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] md:h-12 md:w-12 ${iconClass}`}
      >
        <Icon type={icon} className="h-5 w-5 md:h-6 md:w-6" />
      </span>
      <span className="min-w-0 max-w-full">
        <span className="block max-w-full break-words text-xs font-bold leading-tight text-[#061022] min-[390px]:text-sm">
          {title}
        </span>
        <span className="mt-1 block max-w-full break-words text-[11px] leading-snug text-[#18304d] min-[390px]:text-xs">
          {subtitle}
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={actionClass}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={staticClass}>
      {content}
    </div>
  );
};

const MobileQuickAction = ({ icon, title, subtitle, onClick, accent = "navy" }) => {
  const iconClass =
    accent === "orange" ? "bg-[#fff2d9] text-[#f59e0b]" : "bg-[#e8f0ff] text-[#244783]";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center gap-2.5 rounded-[8px] border border-slate-100 bg-white px-2.5 py-3 text-left shadow-[0_2px_7px_rgba(15,23,42,0.06)] transition hover:border-[#244783]/25 hover:shadow-md"
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] ${iconClass}`}>
        <Icon type={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-bold leading-tight text-[#12213a]">{title}</span>
        <span className="mt-0.5 block truncate text-[9px] leading-tight text-slate-400">{subtitle}</span>
      </span>
      <span className="text-sm leading-none text-slate-400">›</span>
    </button>
  );
};

const getDoctorName = (appointment) => {
  if (appointment.staffId && typeof appointment.staffId === "object") {
    const s = appointment.staffId;
    return `Dr. ${s.firstName || ""} ${s.lastName || ""}`.trim();
  }
  return appointment.doctorName || "Unknown";
};

const AppointmentRow = ({ appointment }) => {
  const status = appointment.status || "upcoming";
  const isPending = status === "pending";

  return (
    <div className="min-w-0 rounded-[12px] border border-slate-200 bg-slate-50/40 px-3 py-4 sm:px-4">
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="max-w-full truncate text-xs font-bold text-[#061022] min-[390px]:text-sm">
            {appointment.serviceName}
          </h4>
          <p className="mt-3 flex min-w-0 items-center gap-2 text-[11px] text-[#18304d] min-[390px]:text-xs">
            <Icon type="user" className="h-4 w-4 shrink-0" />
            <span className="truncate">{getDoctorName(appointment)}</span>
          </p>
          <div className="mt-2 grid min-w-0 gap-2 text-[11px] text-[#18304d] min-[390px]:text-xs sm:grid-cols-2 sm:gap-x-5">
            <span className="flex min-w-0 items-center gap-2">
              <Icon type="calendar" className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {formatAppointmentDate(appointment.date)}
              </span>
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <Icon type="clock" className="h-4 w-4 shrink-0" />
              <span className="truncate">{appointment.time}</span>
            </span>
          </div>
        </div>
        <span
          className={`max-w-[72px] shrink-0 truncate rounded-[8px] border px-1.5 py-0.5 text-[10px] font-semibold leading-5 min-[390px]:max-w-[82px] min-[390px]:px-2 min-[390px]:text-[11px] sm:max-w-[92px] sm:px-2.5 sm:text-xs ${
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

const getAvatarSrc = (avatar) => {
  if (!avatar) return null;
  return avatar;
};

const formatMemberSince = (dateStr) => {
  if (!dateStr) return "Jan 2026";
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const DashboardView = ({
  onBookAppointment,
  onViewAppointments,
  onViewProfile,
  onEmailVerified,
  appointments = [],
  profile,
}) => {
  const [imgError, setImgError] = useState(false);
  const firstName = profile?.name ? profile.name.split(" ")[0] : "";
  const appointmentStats = getAppointmentStats(appointments);
  const [appointmentFilter, setAppointmentFilter] = useState("confirmed");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const filteredAppointments = appointments.filter((appointment) => {
    const status = getAppointmentStatus(appointment);
    if (appointmentFilter === "pending") return status === "pending";
    return status !== "pending";
  });
  const visibleAppointments = filteredAppointments.slice(0, 4);
  const hasMoreAppointments = filteredAppointments.length > visibleAppointments.length;
  useEffect(() => {
    if (!otpOpen) return;
    const sendOtp = async () => {
      setOtpSending(true);
      setOtpError("");
      setOtpSent(false);
      setOtpValue("");
      try {
        const res = await fetch(`${__API_BASE__}/api/auth/sendEmailOtp`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setOtpSent(true);
        } else {
          setOtpError(data.message || "Failed to send OTP");
        }
      } catch {
        setOtpError("Network error. Please try again.");
      } finally {
        setOtpSending(false);
      }
    };
    sendOtp();
  }, [otpOpen]);

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) return;
    setOtpVerifying(true);
    setOtpError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/auth/VerifyEmail`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ OTP: otpValue.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(false);
        setOtpValue("");
        setOtpOpen(false);
        onEmailVerified?.();
      } else {
        setOtpError(data.message || "Invalid OTP");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f7f8fa] px-2.5 py-3 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1060px] space-y-3 sm:space-y-6">
        <section className="relative hidden overflow-hidden rounded-[12px] bg-[#244783] px-7 py-8 text-white shadow-[0_4px_12px_rgba(15,23,42,0.22)] sm:block">
          <div className="absolute -right-12 -top-28 h-64 w-64 rounded-full bg-white/8" />
          <div className="relative z-10 flex items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                Welcome Back{firstName ? `, ${firstName}` : ""}!
              </h1>
              <p className="mt-2 text-sm text-white/95 sm:text-base">
                Here's what's happening with your healthcare today
              </p>
            </div>
            <div className="relative hidden h-16 w-16 shrink-0 items-center justify-center sm:flex">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                {getAvatarSrc(profile?.avatar) && !imgError ? (
                  <img
                    src={getAvatarSrc(profile.avatar)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Icon type="user" className="h-8 w-8" />
                )}
              </div>
              {profile?.isAccountVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          <StatCard
            icon="calendar"
            label="Upcoming"
            value={appointmentStats.upcoming}
          />
          <StatCard
            icon="check"
            label="Completed"
            value={appointmentStats.completed}
            tone="green"
          />
          <StatCard
            icon="clock"
            label="Pending"
            value={appointmentStats.pending}
            tone="orange"
          />
          <StatCard
            icon="bell"
            label="Total"
            value={appointmentStats.total}
            tone="orange"
          />
        </section>

        <section className="hidden grid-cols-1 gap-4 md:grid lg:grid-cols-3">
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
          {profile?.isAccountVerified ? (
            <ActionCard
              icon="check"
              title="Email Verified"
              subtitle="Your email is verified"
            />
          ) : (
            <ActionCard
              icon="mail"
              title="Verify Email"
              subtitle="Send OTP verification"
              accent="orange"
              onClick={() => setOtpOpen(true)}
            />
          )}
        </section>

        <section className="min-w-0 md:hidden">
          <div className="min-w-0 rounded-[8px] border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.07)]">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
              <h2 className="break-words text-sm font-bold leading-tight text-[#061022] sm:text-lg">
                Upcoming Appointments
              </h2>
              <p className="mt-0.5 break-words text-[10px] leading-snug text-[#708095] sm:text-xs">
                Your next scheduled visits
              </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setAppointmentFilter("confirmed")}
                  className={`rounded-[4px] px-1.5 py-1 text-[9px] font-bold ${appointmentFilter === "confirmed" ? "bg-[#244783] text-white" : "border border-slate-200 text-slate-500"}`}
                >
                  Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentFilter("pending")}
                  className={`rounded-[4px] px-1.5 py-1 text-[9px] font-bold ${appointmentFilter === "pending" ? "bg-[#fff2d9] text-[#d97706]" : "border border-[#f5b23c] text-[#d97706]"}`}
                >
                  Pending
                </button>
              </div>
            </div>

            {visibleAppointments.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-[#18304d]">
                No {appointmentFilter} appointments to show.
              </div>
            ) : (
              <div className="space-y-1.5">
                {visibleAppointments.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <MobileQuickAction
              icon="calendar"
              title="Book Appointment"
              subtitle="Schedule a new visit"
              onClick={onBookAppointment}
            />
            <MobileQuickAction
              icon="document"
              title="My Appointments"
              subtitle="View your history"
              onClick={onViewAppointments}
            />
            {profile?.isAccountVerified ? (
              <MobileQuickAction
                icon="check"
                title="Email Verified"
                subtitle="Your email is verified"
              />
            ) : (
              <MobileQuickAction
                icon="mail"
                title="Verify Email"
                subtitle="Send OTP verification"
                accent="orange"
                onClick={() => setOtpOpen(true)}
              />
            )}
            <MobileQuickAction
              icon="user"
              title="Account Status"
              subtitle={profile?.isAccountVerified ? "Active" : "Needs verification"}
              onClick={onViewProfile}
            />
          </div>
        </section>

        <section className="hidden rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_3px_10px_rgba(15,23,42,0.1)] md:block">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#061022]">
                Upcoming Appointments
              </h2>
              <p className="mt-1 text-sm text-[#18304d]">
                Your next scheduled visits
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAppointmentFilter("confirmed")}
                className={`rounded-[8px] border px-4 py-1.5 text-xs font-semibold ${
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
                className={`rounded-[8px] border px-4 py-1.5 text-xs font-semibold ${
                  appointmentFilter === "pending"
                    ? "border-[#ffae0b] bg-[#fff7e6] text-[#f07a00]"
                    : "border-[#ffae0b] text-[#f07a00]"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {visibleAppointments.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-[#18304d]">
              No {appointmentFilter} appointments to show.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
          {hasMoreAppointments && (
            <button
              type="button"
              onClick={onViewAppointments}
              className="mt-5 w-full rounded-[8px] border border-[#244783] px-4 py-2.5 text-sm font-bold text-[#244783] transition hover:bg-[#244783] hover:text-white"
            >
              View more
            </button>
          )}

          <button
            type="button"
            onClick={onBookAppointment}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-[7px] bg-[#244783] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1c396f]"
          >
            <Icon type="calendar" className="h-5 w-5" />
            Book New Appointment
          </button>
        </section>

        <section className="hidden rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_3px_10px_rgba(15,23,42,0.1)] md:hidden">
          <h2 className="text-xl font-bold text-[#061022]">Your Profile</h2>
          <div className="mt-8 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#244783] text-white">
                {getAvatarSrc(profile?.avatar) && !imgError ? (
                  <img
                    src={getAvatarSrc(profile.avatar)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Icon type="user" className="h-8 w-8" />
                )}
              </div>
              {profile?.isAccountVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#061022]">
                {profile?.name || "Sarah Johnson"}
              </h3>
              <p className="mt-1 text-sm text-[#18304d]">
                {profile?.email || "sarah.j@email.com"}
              </p>
            </div>
          </div>
          <div className="my-6 h-px bg-slate-200" />
          <div className="space-y-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#18304d]">Member since</span>
              <strong className="text-[#061022]">{formatMemberSince(profile?.memberSince)}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#18304d]">Total Appointments</span>
              <strong className="text-[#061022]">
                {appointmentStats.total}
              </strong>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewProfile}
            className="mt-8 w-full rounded-[8px] border border-slate-200 px-5 py-2.5 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
          >
            View Full Profile
          </button>
        </section>

        <section className="hidden grid-cols-1 gap-4 md:grid lg:grid-cols-2">
          <div className="rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <h2 className="text-xl font-bold text-[#061022]">Your Profile</h2>
            <div className="mt-8 flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#244783] text-white">
                  {getAvatarSrc(profile?.avatar) && !imgError ? (
                    <img
                      src={getAvatarSrc(profile.avatar)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Icon type="user" className="h-8 w-8" />
                  )}
                </div>
                {profile?.isAccountVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#061022]">
                  {profile?.name || "Sarah Johnson"}
                </h3>
                <p className="mt-1 text-sm text-[#18304d]">
                  {profile?.email || "sarah.j@email.com"}
                </p>
              </div>
            </div>
            <div className="my-6 h-px bg-slate-200" />
            <div className="space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#18304d]">Member since</span>
                <strong className="text-[#061022]">{formatMemberSince(profile?.memberSince)}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#18304d]">Total Appointments</span>
                <strong className="text-[#061022]">
                  {appointmentStats.total}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onViewProfile}
              className="mt-8 w-full rounded-[8px] border border-slate-200 px-5 py-2.5 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
            >
              View Full Profile
            </button>
          </div>

          <div className="rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <h2 className="text-xl font-bold text-[#061022]">
              Account Status
            </h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${profile?.isAccountVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    <Icon type="mail" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-[#061022]">Email Verification</p>
                    <p className="mt-0.5 text-[#18304d]">{profile?.isAccountVerified ? "Verified" : "Not verified"}</p>
                  </div>
                </div>
                {!profile?.isAccountVerified && (
                  <button
                    type="button"
                    onClick={() => setOtpOpen(true)}
                    className="rounded-[8px] bg-[#244783] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1c396f]"
                  >
                    Verify
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-blue-100 text-blue-700">
                    <Icon type="calendar" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-[#061022]">Total Appointments</p>
                    <p className="mt-0.5 text-[#18304d]">{appointmentStats.total} appointment{appointmentStats.total !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#061022]">
                  Verify Email
                </h2>
                <p className="mt-2 text-sm text-[#18304d]">
                  {otpSending
                    ? "Sending OTP to your email..."
                    : otpSent
                      ? "A 6-digit OTP has been sent to your email"
                      : "Sending OTP..."}
                </p>
              </div>
              <button
                type="button"
                className="text-slate-500"
                onClick={() => setOtpOpen(false)}
              >
                x
              </button>
            </div>

            {otpError && (
              <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {otpError}
              </p>
            )}

            <input
              value={otpValue}
              onChange={(event) => setOtpValue(event.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              disabled={otpSending || otpVerifying}
              className="mt-6 h-12 w-full rounded-[8px] border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-[#244783]/30 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpSending || otpVerifying || !otpValue.trim()}
              className="mt-5 w-full rounded-[8px] bg-[#244783] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1c396f] disabled:opacity-50"
            >
              {otpVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardView;
