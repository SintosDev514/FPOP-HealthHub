import React, { useState } from "react";

const StaffScheduleView = ({ onBackToDashboard }) => {
  const [scheduleData] = useState([
    {
      id: 1,
      date: "2026-05-27",
      shift: "Morning",
      startTime: "08:00",
      endTime: "16:00",
      department: "Cardiology",
      status: "Scheduled",
      color: "bg-blue-100"
    },
    {
      id: 2,
      date: "2026-05-28",
      shift: "Afternoon",
      startTime: "12:00",
      endTime: "20:00",
      department: "Emergency",
      status: "Scheduled",
      color: "bg-orange-100"
    },
    {
      id: 3,
      date: "2026-05-29",
      shift: "Night",
      startTime: "20:00",
      endTime: "04:00",
      department: "ICU",
      status: "Scheduled",
      color: "bg-purple-100"
    },
    {
      id: 4,
      date: "2026-05-30",
      shift: "Off",
      startTime: "-",
      endTime: "-",
      department: "N/A",
      status: "Off",
      color: "bg-gray-100"
    },
  ]);

  const subtleShadow = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1">
      <div className="mb-8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-sm font-medium mb-4"
          style={{ color: '#1E3A5F' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }}>My Schedule</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>View and manage your work schedule</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6" style={subtleShadow}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>This Week's Schedule</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition" style={{ color: '#6B7280' }}>← Prev</button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition" style={{ color: '#6B7280' }}>Next →</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleData.map(schedule => (
            <div key={schedule.id} className={`rounded-lg p-4 border-l-4 ${schedule.color}`} style={{
              borderLeftColor: schedule.status === 'Off' ? '#E5E7EB' : '#1E3A5F'
            }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{formatDate(schedule.date)}</p>
                  <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>{schedule.shift}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === 'Off' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                  {schedule.status}
                </span>
              </div>
              
              {schedule.status !== 'Off' && (
                <>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{schedule.department}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6" style={subtleShadow}>
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#1F2937' }}>Shift Statistics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200">
            <p className="text-sm" style={{ color: '#6B7280' }}>Total Hours</p>
            <p className="text-3xl font-bold mt-2" style={{ color: '#1E3A5F' }}>40</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>this week</p>
          </div>
          
          <div className="p-4 rounded-lg border border-slate-200">
            <p className="text-sm" style={{ color: '#6B7280' }}>Shifts Completed</p>
            <p className="text-3xl font-bold mt-2" style={{ color: '#F5C518' }}>2</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>out of 4 scheduled</p>
          </div>
          
          <div className="p-4 rounded-lg border border-slate-200">
            <p className="text-sm" style={{ color: '#6B7280' }}>Days Off</p>
            <p className="text-3xl font-bold mt-2" style={{ color: '#10B981' }}>1</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>this week</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StaffScheduleView;
