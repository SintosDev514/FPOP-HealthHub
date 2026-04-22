import React from "react";
import StaffSidebar from "../../components/StaffSidebar";

const StaffDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <StaffSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0">
        {/* Header - Desktop only or adjusted for mobile */}
        <header className="hidden md:flex h-20 bg-white border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full max-w-md gap-3 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="bg-transparent border-none outline-none text-sm w-full"
              style={{ color: "#1F2937" }}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white" style={{ backgroundColor: "#EF4444" }}>
                3
              </span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E0E7FF", color: "#1E3A5F" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold" style={{ color: "#1F2937" }}>Dr. Sarah Johnson</span>
                <span className="text-xs" style={{ color: "#6B7280" }}>Staff</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="p-4 md:p-8 space-y-8 mt-4 md:mt-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Today's Appointments", value: "8", color: "#3B82F6", bg: "#EFF6FF" },
              { label: "Checked In", value: "1", color: "#10B981", bg: "#ECFDF5" },
              { label: "Waiting", value: "5", color: "#F97316", bg: "#FFF7ED" },
              { label: "Completed", value: "1", color: "#8B5CF6", bg: "#F5F3FF" }
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: "#6B7280" }}>{stat.label}</p>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                    {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                    {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {idx === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5" style={{ color: "#1F2937" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>Recent Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border group transition-colors" style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#E0E7FF", color: "#1E3A5F" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1F2937" }}>New appointment scheduled for 15:00 with Dr. Smith</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>5 minutes ago</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
