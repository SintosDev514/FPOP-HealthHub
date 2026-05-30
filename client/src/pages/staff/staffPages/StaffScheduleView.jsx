import React from "react";

const shiftCards = [
  {
    title: "Morning Shift",
    count: 12,
    detail: "Staff scheduled",
    icon: "sun",
    className: "from-[#F5C518] to-[#F59E0B]",
  },
  {
    title: "Afternoon Shift",
    count: 8,
    detail: "Staff scheduled",
    icon: "sunset",
    className: "from-[#FF6B3D] to-[#EF4444]",
  },
  {
    title: "Night Shift",
    count: 6,
    detail: "Staff scheduled",
    icon: "moon",
    className: "from-[#435B9C] to-[#1E3A5F]",
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

const ShiftCard = ({ title, count, detail, icon, className }) => (
  <article
    className={`flex min-h-[180px] max-w-[245px] flex-col justify-between rounded-md bg-gradient-to-br p-5 text-white shadow-md ${className}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-lg font-semibold text-white/95">{title}</p>
        <p className="mt-5 text-6xl font-bold leading-none">{count}</p>
      </div>
      <div className="mt-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Icon name={icon} className="h-9 w-9" />
      </div>
    </div>
    <p className="text-lg font-medium text-white/95">{detail}</p>
  </article>
);

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full bg-[#E4F2FF] px-3 py-1 text-base font-bold text-[#0071CE]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Scheduled: "bg-[#1976D2]",
    "In Progress": "bg-[#2E7D32]",
    "On Leave": "bg-[#EF6C00]",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-base font-bold text-white ${styles[status]}`}
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
  <main className="flex-1 px-4 py-8 sm:px-8 lg:px-[60px]">
    <section className="mb-8 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
      {shiftCards.map((card) => (
        <ShiftCard key={card.title} {...card} />
      ))}
    </section>

    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead className="bg-gradient-to-r from-[#435B9C] to-[#1E3A5F] text-white">
            <tr>
              <th className="w-[265px] px-5 py-6 text-base font-bold">
                Staff Name
              </th>
              <th className="w-[150px] px-5 py-6 text-base font-bold">
                Department
              </th>
              <th className="w-[160px] px-5 py-6 text-base font-bold">
                Shift
              </th>
              <th className="w-[190px] px-5 py-6 text-base font-bold">Time</th>
              <th className="w-[190px] px-5 py-6 text-base font-bold">Date</th>
              <th className="w-[150px] px-5 py-6 text-base font-bold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-200 transition hover:bg-[#F9FAFB]"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6F5CC2] text-xl font-medium text-white">
                      {row.initials}
                    </div>
                    <span className="text-xl font-bold text-black">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <DepartmentBadge>{row.department}</DepartmentBadge>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3 text-xl text-black">
                    <Icon
                      name={shiftIcon[row.shift]}
                      className={`h-6 w-6 ${shiftColor[row.shift]}`}
                    />
                    <span>{row.shift}</span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3 text-xl text-black">
                    <Icon name="clock" className="h-5 w-5 text-[#6B7280]" />
                    <span>{row.time}</span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3 text-xl text-black">
                    <Icon name="calendar" className="h-5 w-5 text-[#6B7280]" />
                    <span>{row.date}</span>
                  </div>
                </td>
                <td className="px-5 py-5">
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
