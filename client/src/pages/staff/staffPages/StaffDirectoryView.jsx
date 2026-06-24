import React, { useState, useEffect } from "react";

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[9px] font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${
        isActive ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ffedd5] text-[#ea580c]"
      }`}
    >
      {status}
    </span>
  );
};

const StaffDirectoryView = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/staff", {
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

      <section className="overflow-hidden rounded-2xl border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="w-[150px] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Name</th>
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
                staffList.map((member, idx) => (
                  <tr
                    key={member._id}
                    className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
                  >
                    <td className="px-5 py-4 text-[10px] font-semibold text-[#2d3748]">
                      {member.name}
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
    </main>
  );
};

export default StaffDirectoryView;
