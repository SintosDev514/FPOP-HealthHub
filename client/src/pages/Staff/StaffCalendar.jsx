import React, { useState } from "react";
import StaffSidebar from "../../components/StaffSidebar";

const StaffCalendar = () => {
  const [currentDate] = useState(new Date(2026, 3, 22)); // April 22, 2026
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Mock appointment data: day of month -> count
  const appointments = {
    5: 2,
    12: 5,
    18: 1,
    20: 8,
    22: 3,
    25: 10,
    28: 4
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <StaffSidebar />
      <main className="flex-1 flex flex-col pt-20 md:pt-8 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>Clinic Schedule</h1>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto justify-between">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-bold text-lg min-w-[140px] text-center" style={{ color: "#1E3A5F" }}>
              {monthName} {year}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 min-h-[500px]">
              {days.map((day, idx) => {
                const count = appointments[day] || 0;
                const hasAppointments = count > 0;
                const isToday = day === todayDay && month === todayMonth && year === todayYear;
                
                return (
                  <div key={idx} className={`border-r border-b border-gray-50 p-4 transition-all duration-200 relative group ${day ? "hover:bg-blue-50/30" : "bg-gray-50/20"} ${isToday ? "bg-blue-50/20" : ""}`}>
                    {day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-[#1E3A5F] text-white" : "text-[#9CA3AF]"}`}>
                            {day}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col items-center justify-center">
                          {hasAppointments ? (
                            <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-sm transform transition-transform group-hover:scale-110" style={{ backgroundColor: count > 5 ? "#1E3A5F" : "#E0E7FF", color: count > 5 ? "white" : "#1E3A5F" }}>
                              <span className="text-xl font-bold leading-none">{count}</span>
                              <span className="text-[8px] uppercase font-bold mt-0.5 opacity-80">Appts</span>
                            </div>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4 items-center pb-8">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1E3A5F" }} />
              <span className="text-xs font-medium" style={{ color: "#6B7280" }}>High Volume (5+)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E0E7FF" }} />
              <span className="text-xs font-medium" style={{ color: "#6B7280" }}>Standard Volume</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs font-medium" style={{ color: "#6B7280" }}>No Appointments</span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default StaffCalendar;
