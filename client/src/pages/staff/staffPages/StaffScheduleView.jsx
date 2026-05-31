import React from "react";

const shiftCards = [
  {
    title: "Morning Shift",
    count: 12,
    detail: "Staff scheduled",
    icon: "sun",
    tone: "gold",
  },
  {
    title: "Afternoon Shift",
    count: 8,
    detail: "Staff scheduled",
    icon: "sunset",
    tone: "orange",
  },
  {
    title: "Night Shift",
    count: 6,
    detail: "Staff scheduled",
    icon: "moon",
    tone: "navy",
  },
];

const scheduleRows = [
  {
    id: 1,
    initials: "DJS",
    name: "Dr. John Smith",
    department: "Cardiology",
    shift: "Morning",
    time: "08:00 - 16:00",
    date: "2026-05-26",
    status: "Scheduled",
  },
  {
    id: 2,
    initials: "SJ",
    name: "Sarah Johnson",
    department: "Nursing",
    shift: "Night",
    time: "20:00 - 04:00",
    date: "2026-05-26",
    status: "Scheduled",
  },
  {
    id: 3,
    initials: "MC",
    name: "Michael Chen",
    department: "Emergency",
    shift: "Afternoon",
    time: "12:00 - 20:00",
    date: "2026-05-26",
    status: "In Progress",
  },
  {
    id: 4,
    initials: "ED",
    name: "Emily Davis",
    department: "Pediatrics",
    shift: "Morning",
    time: "08:00 - 16:00",
    date: "2026-05-26",
    status: "On Leave",
  },
  {
    id: 5,
    initials: "DW",
    name: "David Wilson",
    department: "Radiology",
    shift: "Morning",
    time: "07:00 - 15:00",
    date: "2026-05-27",
    status: "Scheduled",
  },
  {
    id: 6,
    initials: "LA",
    name: "Lisa Anderson",
    department: "Laboratory",
    shift: "Afternoon",
    time: "14:00 - 22:00",
    date: "2026-05-27",
    status: "Scheduled",
  },
];

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

const StatusBadge = ({ status }) => {
  const styles = {
    Scheduled: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
    "In Progress": "bg-[#dcfce7] text-[#15803d]",
    "On Leave": "bg-[#ffedd5] text-[#ea580c]",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const shiftIcon = {
  Morning: "sun",
  Afternoon: "sunset",
  Night: "moon",
};

const shiftColor = {
  Morning: "text-[#F59E0B]",
  Afternoon: "text-[#FF6B3D]",
  Night: "text-[#435B9C]",
};

const StaffScheduleView = () => (
  <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {shiftCards.map((card) => (
        <ShiftCard key={card.title} {...card} />
      ))}
    </section>

    <section className="overflow-hidden rounded-2xl border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead className="bg-[#1E3A5F] text-white">
            <tr>
              <th className="w-[265px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Staff Name
              </th>
              <th className="w-[150px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Department
              </th>
              <th className="w-[160px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Shift
              </th>
              <th className="w-[190px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">Time</th>
              <th className="w-[190px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">Date</th>
              <th className="w-[150px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F] text-sm font-bold text-[#F5C518]">
                      {row.initials}
                    </div>
                    <span className="text-sm font-bold text-[#2d3748]">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <DepartmentBadge>{row.department}</DepartmentBadge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-sm text-[#2d3748]">
                    <Icon
                      name={shiftIcon[row.shift]}
                      className={`h-6 w-6 ${shiftColor[row.shift]}`}
                    />
                    <span>{row.shift}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-sm text-[#5a6475]">
                    <Icon name="clock" className="h-5 w-5 text-[#6B7280]" />
                    <span>{row.time}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-sm text-[#5a6475]">
                    <Icon name="calendar" className="h-5 w-5 text-[#6B7280]" />
                    <span>{row.date}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </main>
);

export default StaffScheduleView;
