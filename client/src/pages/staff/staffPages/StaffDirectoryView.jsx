import React, { useState, useEffect } from "react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
};

const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const getActiveDays = (schedule) =>
  DAY_LABELS.map((label, i) => ({
    label,
    ...((schedule && (schedule[i] || schedule[String(i)])) || {}),
  })).filter((d) => d.active);

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[9px] font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const Avatar = ({ member, className = "h-10 w-10 text-[9px]" }) => (
  <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1E3A5F] font-bold text-[#F5C518] ${className}`}>
    {member?.avatar ? (
      <img
        src={member.avatar}
        alt={member.name}
        className="h-full w-full object-cover"
        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "flex"; }}
      />
    ) : null}
    <div className={`flex h-full w-full items-center justify-center ${member?.avatar ? "hidden" : "flex"}`}>
      {getInitials(member?.name)}
    </div>
  </div>
);

const StaffProfileModal = ({ member, onClose }) => {
  if (!member) return null;
  const activeDays = getActiveDays(member.schedule);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 rounded-t-xl bg-gradient-to-r from-[#1E3A5F] to-[#264a77] px-6 py-5">
          <Avatar member={member} className="h-16 w-16 text-sm" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-extrabold text-white">{member.name}</h3>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
              {member.specialty || "Healthcare Staff"}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80">
              Active Staff
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a96a3]">Contact</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-[#f7fafc] px-4 py-3">
                <svg className="h-4 w-4 shrink-0 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-medium text-[#2d3748]">{member.email || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-[#f7fafc] px-4 py-3">
                <svg className="h-4 w-4 shrink-0 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[10px] font-medium text-[#2d3748]">{member.phone || "Not provided"}</span>
              </div>
              {member.address ? (
                <div className="flex items-center gap-3 rounded-lg bg-[#f7fafc] px-4 py-3">
                  <svg className="h-4 w-4 shrink-0 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[10px] font-medium text-[#2d3748]">{member.address}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a96a3]">Weekly Schedule</p>
            {activeDays.length === 0 ? (
              <p className="rounded-lg bg-[#f7fafc] px-4 py-3 text-[10px] text-[#8a96a3]">No schedule set</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {activeDays.map((day) => (
                  <div key={day.label} className="rounded-lg border border-[#15803d]/20 bg-[#dcfce7] px-3 py-2 text-center">
                    <p className="text-[9px] font-bold uppercase text-[#15803d]">{day.label}</p>
                    <p className="mt-1 text-[9px] font-semibold text-[#166534]">
                      {formatTime(day.start)} – {formatTime(day.end)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDirectoryView = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/staff`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.error("Failed to load staff:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
      <section className="mb-7">
        <h2 className="text-base font-extrabold leading-tight text-[#1E3A5F]">
          Staff Directory
        </h2>
        <p className="mt-1.5 text-[10px] font-medium text-[#8a96a3]">
          Total Staff Members: {loading ? "..." : staffList.length}
        </p>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="w-[260px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Name</th>
                <th className="w-[210px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Specialty
                </th>
                <th className="w-[300px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Email
                </th>
                <th className="w-[150px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Schedule
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[10px] text-[#8a96a3]">Loading...</td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[10px] text-[#8a96a3]">No staff found</td>
                </tr>
              ) : (
                staffList.map((member) => (
                  <tr
                    key={member._id}
                    onClick={() => setSelected(member)}
                    className="cursor-pointer border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar member={member} />
                        <span className="text-[10px] font-semibold text-[#2d3748]">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <DepartmentBadge>{member.specialty || "General"}</DepartmentBadge>
                    </td>
                    <td className="px-5 py-4 text-[10px] text-[#5a6475]">
                      {member.email}
                    </td>
                    <td className="px-5 py-4 text-[10px] text-[#5a6475]">
                      {member.schedule ? `${Object.values(member.schedule).filter((d) => d?.active).length} days` : "Not set"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && <StaffProfileModal member={selected} onClose={() => setSelected(null)} />}
    </main>
  );
};

export default StaffDirectoryView;
