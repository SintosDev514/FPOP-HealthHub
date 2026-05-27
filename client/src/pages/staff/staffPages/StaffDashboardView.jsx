import React from "react";

const StaffDashboardView = ({ onViewSchedule, onViewProfile, profile, stats = {} }) => {
  const subtleShadow = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
  };

  const defaultStats = {
    todayShifts: 8,
    attendanceRate: 96,
    completedTasks: 42,
    pendingTasks: 5,
    ...stats
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="rounded-xl p-6 mb-8 flex justify-between items-center" style={{ ...subtleShadow, backgroundColor: '#1E3A5F' }}>
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome Back, {profile?.name.split(' ')[0] || 'Staff'}!</h2>
          <p className="text-sm mt-1 text-white/80">Here's your work summary for today</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          type="button"
          onClick={onViewSchedule}
          className="bg-white rounded-xl p-6 text-left transition-transform hover:-translate-y-0.5"
          style={subtleShadow}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>My Schedule</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>View shifts</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>{defaultStats.todayShifts}</div>
          <p className="text-xs text-slate-500 mt-1">shifts this week</p>
        </button>

        <button onClick={onViewProfile} className="bg-white rounded-xl p-6 text-left transition-transform hover:-translate-y-0.5" style={subtleShadow}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Tasks</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>Assigned to you</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#F5C518' }}>{defaultStats.completedTasks}</div>
          <p className="text-xs text-slate-500 mt-1">completed</p>
        </button>

        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Attendance</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>This month</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5C518' }}>
              <svg className="w-5 h-5" style={{ color: '#1F2937' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>{defaultStats.attendanceRate}%</div>
          <p className="text-xs text-slate-500 mt-1">attendance rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <svg className="w-5 h-5" style={{ color: '#1E3A5F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Today</p>
            <p className="text-3xl font-bold" style={{ color: '#1F2937' }}>8h</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>On Time</p>
            <p className="text-3xl font-bold" style={{ color: '#1F2937' }}>96%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <svg className="w-5 h-5" style={{ color: '#F5C518' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Pending</p>
            <p className="text-3xl font-bold" style={{ color: '#F5C518' }}>{defaultStats.pendingTasks}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Department</p>
            <p className="text-2xl font-bold" style={{ color: '#1F2937' }}>{profile?.department || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={onViewSchedule} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition flex items-center gap-3 border border-slate-200">
              <svg className="w-5 h-5" style={{ color: '#1E3A5F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium" style={{ color: '#1F2937' }}>Check Schedule</span>
            </button>
            <button onClick={onViewProfile} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition flex items-center gap-3 border border-slate-200">
              <svg className="w-5 h-5" style={{ color: '#1E3A5F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium" style={{ color: '#1F2937' }}>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 mt-2 rounded-full" style={{ backgroundColor: '#F5C518' }}></div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Shift completed</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>Morning shift - 2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 mt-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Task assigned</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>New patient intake - 1 day ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full" style={{ backgroundColor: '#1E3A5F' }}></div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Schedule updated</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>Next week's schedule - 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StaffDashboardView;
