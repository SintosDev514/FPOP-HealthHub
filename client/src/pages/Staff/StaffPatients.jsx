import React from "react";
import StaffSidebar from "../../components/StaffSidebar";

const StaffPatients = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <StaffSidebar />
      <main className="flex-1 flex flex-col pt-20 md:pt-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#1F2937" }}>Patients</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-semibold text-sm" style={{ color: "#1F2937" }}>Name</th>
                  <th className="py-4 font-semibold text-sm" style={{ color: "#1F2937" }}>Age</th>
                  <th className="py-4 font-semibold text-sm" style={{ color: "#1F2937" }}>Contact</th>
                  <th className="py-4 font-semibold text-sm" style={{ color: "#1F2937" }}>Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: "Juan Dela Cruz", age: 34, contact: "09123456789", last: "Apr 20, 2026" },
                  { name: "Maria Clara", age: 28, contact: "09987654321", last: "Apr 21, 2026" },
                  { name: "Pedro Penduko", age: 45, contact: "09112233445", last: "Mar 15, 2026" },
                ].map((patient, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium" style={{ color: "#1F2937" }}>{patient.name}</td>
                    <td className="py-4 text-sm" style={{ color: "#6B7280" }}>{patient.age}</td>
                    <td className="py-4 text-sm" style={{ color: "#6B7280" }}>{patient.contact}</td>
                    <td className="py-4 text-sm" style={{ color: "#6B7280" }}>{patient.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffPatients;
