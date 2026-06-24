import React from "react";

const reportStats = [
  {
    label: "Total Reports",
    value: 8,
    icon: "file",
    tone: "navy",
  },
  {
    label: "Available",
    value: 6,
    icon: "check",
    tone: "green",
  },
  {
    label: "Processing",
    value: 1,
    icon: "alert",
    tone: "orange",
  },
  {
    label: "Downloads",
    value: 142,
    icon: "trend",
    tone: "gold",
  },
];

const reports = [
  {
    title: "Monthly Staff Performance",
    department: "All Departments",
    type: "Performance",
    generatedBy: "System",
    date: "2026-05-01",
    status: "Available",
  },
  {
    title: "Attendance Report - April",
    department: "Human Resources",
    type: "Attendance",
    generatedBy: "Emily Davis",
    date: "2026-05-02",
    status: "Available",
  },
  {
    title: "Department Budget Summary",
    department: "Finance",
    type: "Financial",
    generatedBy: "Lisa Anderson",
    date: "2026-05-10",
    status: "Available",
  },
  {
    title: "Patient Satisfaction Survey",
    department: "Quality Assurance",
    type: "Survey",
    generatedBy: "Sarah Johnson",
    date: "2026-05-15",
    status: "Available",
  },
  {
    title: "Incident Report - May",
    department: "Safety",
    type: "Incident",
    generatedBy: "Robert Taylor",
    date: "2026-05-20",
    status: "Processing",
  },
  {
    title: "Equipment Maintenance Log",
    department: "Engineering",
    type: "Maintenance",
    generatedBy: "James Brown",
    date: "2026-05-22",
    status: "Available",
  },
  {
    title: "Training Completion Report",
    department: "Human Resources",
    type: "Training",
    generatedBy: "Emily Davis",
    date: "2026-05-24",
    status: "Available",
  },
];

const Icon = ({ name, className = "h-6 w-6" }) => {
  const paths = {
    file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6M9 17h6",
    check: "m8 12 3 3 6-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    alert: "M12 8v4M12 16h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
    download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
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
  navy: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  green: "bg-[#dcfce7] text-[#22c55e]",
  orange: "bg-[#ffedd5] text-[#ea580c]",
  gold: "bg-[#F5C518]/20 text-[#B88900]",
};

const StatCard = ({ label, value, icon, tone = "navy" }) => (
  <article
    className="rounded-2xl border border-[#1E3A5F]/[0.07] bg-white px-5 py-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(30,58,95,0.14)]"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-[#8a96a3]">
          {label}
        </p>
        <p className="mt-2 text-[20px] font-extrabold leading-none text-[#1E3A5F]">
          {value}
        </p>
      </div>
      <div className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl ${statTones[tone] || statTones.navy}`}>
        <Icon name={icon} className="h-[22px] w-[22px]" />
      </div>
    </div>
  </article>
);

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[9px] font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const TypeBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full border border-[#1E3A5F]/10 bg-white px-2.5 py-1 text-[9px] font-semibold text-[#5a6475]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const isAvailable = status === "Available";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${
        isAvailable ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ffedd5] text-[#ea580c]"
      }`}
    >
      {status}
    </span>
  );
};

const DownloadButton = () => (
  <button
    type="button"
    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#1E3A5F] px-3 py-2 text-[9px] font-bold text-white shadow transition hover:bg-[#264a77]"
  >
    <Icon name="download" className="h-4 w-4" />
    Download
  </button>
);

const StaffReportsView = () => (
  <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
    <section className="mb-7">
      <h2 className="text-base font-extrabold leading-tight text-[#1E3A5F]">
        Reports
      </h2>
      <p className="mt-1.5 text-[10px] font-medium text-[#8a96a3]">
        Access and download generated reports
      </p>
    </section>

    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reportStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>

    <section className="hidden overflow-hidden rounded-2xl border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)] lg:block">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-[#1E3A5F] text-white">
            <tr>
              <th className="w-[25%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                Report Title
              </th>
              <th className="w-[15%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                Department
              </th>
              <th className="w-[11%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Type</th>
              <th className="w-[14%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                Generated By
              </th>
              <th className="w-[12%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Date</th>
              <th className="w-[10%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                Status
              </th>
              <th className="w-[13%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.title}
                className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F]">
                      <Icon name="file" className="h-5 w-5" />
                    </div>
                    <span className="min-w-0 text-[10px] font-bold text-[#2d3748]">
                      {report.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <DepartmentBadge>{report.department}</DepartmentBadge>
                </td>
                <td className="px-4 py-4">
                  <TypeBadge>{report.type}</TypeBadge>
                </td>
                <td className="px-4 py-4 text-[10px] text-[#5a6475]">
                  {report.generatedBy}
                </td>
                <td className="px-4 py-4 text-[10px] text-[#5a6475]">
                  {report.date}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-4">
                  {report.status === "Available" && <DownloadButton />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section className="space-y-4 lg:hidden">
      {reports.map((report) => (
        <article
          key={report.title}
          className="rounded-2xl border border-[#1E3A5F]/[0.07] bg-white p-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)]"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F]">
              <Icon name="file" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] font-bold text-[#1E3A5F]">{report.title}</h3>
              <p className="mt-1 text-[10px] text-[#6B7280]">
                Generated by {report.generatedBy}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                Department
              </p>
              <DepartmentBadge>{report.department}</DepartmentBadge>
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                Type
              </p>
              <TypeBadge>{report.type}</TypeBadge>
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                Date
              </p>
              <p className="text-[11px] text-black">{report.date}</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                Status
              </p>
              <StatusBadge status={report.status} />
            </div>
          </div>

          {report.status === "Available" && (
            <div className="mt-5">
              <DownloadButton />
            </div>
          )}
        </article>
      ))}
    </section>
  </main>
);

export default StaffReportsView;
