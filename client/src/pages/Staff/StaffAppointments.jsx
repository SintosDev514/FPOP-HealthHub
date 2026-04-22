import React from "react";
import StaffSidebar from "../../components/StaffSidebar";

const StaffAppointments = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <StaffSidebar />
      <main className="flex-1 flex flex-col pt-20 md:pt-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#1F2937" }}>Appointments</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <p style={{ color: "#6B7280" }}>Manage clinic appointments here.</p>
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                    P{i}
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base" style={{ color: "#1F2937" }}>Patient {i}</p>
                    <p className="text-xs md:text-sm" style={{ color: "#6B7280" }}>10:30 AM - General Checkup</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffAppointments;
