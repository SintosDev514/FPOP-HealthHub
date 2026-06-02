import React, { useState } from "react";

const Icon = ({ type, className = "h-5 w-5" }) => {
  const paths = {
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    chart: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    alert: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    filter:
      "M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6L14 13.667V19a1 1 0 01-1.447.894l-3-1.5A1 1 0 019 17.5v-3.833L3.2 4.6A1 1 0 013 4z",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    location:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    chevron: "M19 9l-7 7-7-7",
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  );
};

const formatDate = (date) => {
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
    { total: 0, upcoming: 0, completed: 0, pending: 0 }
  );

const StatCard = ({ icon, label, value, tone = "neutral" }) => {
  const tones = {
    neutral: {
      card: "border-slate-200 bg-white text-[#061022]",
      icon: "bg-slate-50 text-[#334155]",
    },
    blue: {
      card: "border-blue-200 bg-blue-50/40 text-blue-700",
      icon: "bg-blue-100 text-blue-700",
    },
    green: {
      card: "border-green-200 bg-green-50/60 text-green-700",
      icon: "bg-green-100 text-green-700",
    },
    orange: {
      card: "border-amber-300 bg-amber-50/50 text-[#b45309]",
      icon: "bg-amber-100 text-[#ea580c]",
    },
  };
  const selectedTone = tones[tone];

  return (
    <div className={`rounded-[12px] border p-6 ${selectedTone.card}`}>
      <div className="flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${selectedTone.icon}`}>
          <Icon type={icon} />
        </span>
        <strong className="text-3xl font-bold leading-none">{value}</strong>
      </div>
      <p className="mt-5 text-sm font-bold">{label}</p>
    </div>
  );
};

const statusStyles = {
  upcoming: {
    rail: "border-l-blue-600",
    tile: "border-blue-100 bg-blue-50 text-blue-600",
    badge: "border-blue-200 bg-blue-100 text-blue-700",
    icon: "calendar",
  },
  completed: {
    rail: "border-l-[#00a65a]",
    tile: "border-green-100 bg-green-50 text-green-600",
    badge: "border-green-200 bg-green-100 text-green-700",
    icon: "check",
  },
  pending: {
    rail: "border-l-[#ff9500]",
    tile: "border-amber-100 bg-amber-50 text-[#f07a00]",
    badge: "border-amber-300 bg-amber-100 text-[#b45309]",
    icon: "alert",
  },
};

const demoAppointments = [
  {
    id: "demo-vaccination",
    serviceName: "Vaccination",
    doctorName: "Dr. Michael Chen",
    date: new Date(2026, 1, 5),
    time: "01:00 PM",
    location: "Main Clinic",
    status: "completed",
  },
  {
    id: "demo-mental-health",
    serviceName: "Mental Health Screening",
    doctorName: "Dr. Emily Rodriguez",
    date: new Date(2026, 0, 30),
    time: "10:30 AM",
    location: "Main Clinic",
    status: "completed",
  },
  {
    id: "demo-contraception",
    serviceName: "Contraception Counseling",
    doctorName: "Dr. Sarah Johnson",
    date: new Date(2026, 0, 25),
    time: "03:30 PM",
    location: "Main Clinic",
    status: "completed",
  },
  {
    id: "demo-bp",
    serviceName: "Blood Pressure Check",
    doctorName: "Dr. James Wilson",
    date: new Date(2026, 0, 20),
    time: "11:00 AM",
    location: "Main Clinic",
    status: "completed",
  },
  {
    id: "demo-ultrasound",
    serviceName: "Ultrasound Appointment",
    doctorName: "Dr. Emily Rodriguez",
    date: new Date(2026, 3, 8),
    time: "01:30 PM",
    location: "Main Clinic",
    status: "pending",
  },
];

const normalizeAppointment = (appointment) => {
  const staffName =
    appointment.staffId && typeof appointment.staffId === "object"
      ? `${appointment.staffId.firstName || ""} ${appointment.staffId.lastName || ""}`.trim()
      : appointment.doctorName || "Unknown";
  return {
    id: appointment._id || appointment.id,
    serviceName: appointment.serviceName,
    doctorName: staffName,
    date: appointment.date ? new Date(appointment.date + "T00:00:00") : appointment.date,
    time: appointment.time,
    location: appointment.location || "Main Clinic",
    status: getAppointmentStatus(appointment),
  };
};

const AppointmentCard = ({ appointment, onSelect }) => {
  const status = appointment.status || "upcoming";
  const style = statusStyles[status] || statusStyles.upcoming;

  return (
    <button
      type="button"
      onClick={() => onSelect(appointment)}
      className={`w-full rounded-[12px] border border-slate-200 border-l-[5px] ${style.rail} bg-white p-7 text-left shadow-[0_1px_5px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-start gap-5">
        <div className={`hidden h-[118px] w-[62px] shrink-0 items-start justify-center rounded-[12px] border pt-5 sm:flex ${style.tile}`}>
          <Icon type="calendar" className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#061022]">{appointment.serviceName}</h2>
              <p className="mt-6 flex items-center gap-3 text-base font-medium text-[#18304d]">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
                  <Icon type="user" className="h-4 w-4" />
                </span>
                {appointment.doctorName}
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 self-start rounded-[8px] border px-3 py-1 text-xs font-bold capitalize ${style.badge}`}>
              <Icon type={style.icon} className="h-3.5 w-3.5" />
              {status}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#18304d]">
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
                <Icon type="calendar" className="h-4 w-4" />
              </span>
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
                <Icon type="clock" className="h-4 w-4" />
              </span>
              {appointment.time}
            </span>
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500">
                <Icon type="location" className="h-4 w-4" />
              </span>
              {appointment.location}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const MyAppointmentsView = ({ appointments = [], onNavigateToBook }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const realAppointments = appointments.map(normalizeAppointment);
  const visibleAppointments = [...realAppointments, ...demoAppointments];
  const appointmentStats = getAppointmentStats(visibleAppointments);
  const filteredAppointments = visibleAppointments.filter((appointment) => {
    if (statusFilter === "all") return true;
    return getAppointmentStatus(appointment) === statusFilter;
  });

  return (
    <main className="flex-1 bg-[#f7f8fa] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1234px] space-y-10">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#061022]">My Appointments</h1>
            <p className="mt-3 text-lg text-[#334155]">Manage and track your healthcare appointments</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToBook}
            className="flex items-center justify-center gap-3 rounded-[7px] bg-[#244783] px-5 py-4 text-sm font-bold text-white shadow-[0_3px_7px_rgba(15,23,42,0.22)] transition hover:bg-[#1c396f]"
          >
            <Icon type="calendar" />
            Book New Appointment
          </button>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="chart" label="Total Appointments" value={appointmentStats.total} />
          <StatCard icon="calendar" label="Upcoming" value={appointmentStats.upcoming} tone="blue" />
          <StatCard icon="check" label="Completed" value={appointmentStats.completed} tone="green" />
          <StatCard icon="alert" label="Pending" value={appointmentStats.pending} tone="orange" />
        </section>

        <section className="flex flex-col gap-4 rounded-[12px] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef5ff] text-[#244783]">
              <Icon type="filter" />
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-w-[256px] appearance-none rounded-[7px] bg-slate-100 px-4 py-3 text-sm font-bold text-[#061022] outline-none"
            >
              <option value="all">All Appointments</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-[#18304d]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#546c9a]" />
            {appointmentStats.total} appointments
          </div>
        </section>

        {filteredAppointments.length === 0 ? (
          <section className="rounded-[12px] border border-slate-200 bg-white p-12 text-center shadow-[0_1px_5px_rgba(15,23,42,0.05)]">
            <p className="mb-6 text-lg text-[#334155]">No {statusFilter} appointments to show.</p>
            <button
              type="button"
              onClick={onNavigateToBook}
              className="rounded-[7px] bg-[#244783] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#1c396f]"
            >
              Book an Appointment Now
            </button>
          </section>
        ) : (
          <section className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onSelect={setSelectedAppointment}
              />
            ))}
          </section>
        )}
      </div>
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-[12px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#061022]">{selectedAppointment.serviceName}</h2>
                <p className="mt-2 text-sm capitalize text-[#18304d]">{selectedAppointment.status}</p>
              </div>
              <button
                type="button"
                className="text-slate-500"
                onClick={() => setSelectedAppointment(null)}
              >
                x
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="text-slate-500">Provider</p>
                <p className="mt-1 font-bold text-[#061022]">{selectedAppointment.doctorName}</p>
              </div>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="text-slate-500">Date & Time</p>
                <p className="mt-1 font-bold text-[#061022]">
                  {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                </p>
              </div>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="text-slate-500">Location</p>
                <p className="mt-1 font-bold text-[#061022]">{selectedAppointment.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyAppointmentsView;
