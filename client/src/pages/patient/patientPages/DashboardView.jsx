import React from "react";


const DashboardView = ({ onBookAppointment, onViewAppointments, onViewProfile, appointments = [], profile }) => {
  const subtleShadow = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
  };


  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="rounded-xl p-6 mb-8 flex justify-between items-center" style={{ ...subtleShadow, backgroundColor: '#1E3A5F' }}>
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome Back, {profile?.name.split(' ')[0] || 'User'}!</h2>
          <p className="text-sm mt-1 text-white/80">Here's what's happening with your healthcare today</p>
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
          onClick={onBookAppointment}
          className="bg-white rounded-xl p-6 text-left transition-transform hover:-translate-y-0.5"
          style={subtleShadow}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Book Appointment</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>Schedule a visit</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>12</div>
        </button>
        <button onClick={onViewAppointments} className="bg-white rounded-xl p-6 text-left transition-transform hover:-translate-y-0.5" style={subtleShadow}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>My Appointments</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>View history</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-base font-semibold" style={{ color: '#F5C518' }}>View All</div>
        </button>
        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Verify Email</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>Send OTP</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5C518' }}>
              <svg className="w-5 h-5" style={{ color: '#1F2937' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <button className="text-sm font-medium mt-2" style={{ color: '#1E3A5F' }}>Send OTP →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <svg className="w-5 h-5" style={{ color: '#1E3A5F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Upcoming</p><p className="text-3xl font-bold" style={{ color: '#1F2937' }}>2</p></div>
        </div>
        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Completed</p><p className="text-3xl font-bold" style={{ color: '#1F2937' }}>12</p></div>
        </div>
        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <svg className="w-5 h-5" style={{ color: '#F5C518' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Pending</p><p className="text-3xl font-bold" style={{ color: '#F5C518' }}>1</p></div>
        </div>
        <div className="bg-white rounded-xl p-5 flex items-center gap-4" style={subtleShadow}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <svg className="w-5 h-5" style={{ color: '#F5C518' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Reminders</p><p className="text-3xl font-bold" style={{ color: '#1F2937' }}>3</p></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Upcoming Appointments</h3>
        {(!appointments || appointments.length === 0) ? (
          <div className="bg-white rounded-xl p-8 text-center" style={subtleShadow}>
            <p className="text-slate-500">No upcoming appointments. Schedule one today!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden" style={subtleShadow}>
            {appointments.map((appt, idx) => (
              <div key={appt.id} className={`p-4 ${idx < appointments.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{appt.serviceName}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{appt.doctorName}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs flex items-center" style={{ color: '#6B7280' }}><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{appt.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-xs flex items-center" style={{ color: '#6B7280' }}><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{appt.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          type="button"
          onClick={onBookAppointment}
          className="px-6 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#1E3A5F', color: 'white' }}
        >
          Book New
        </button>
        <button className="px-6 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}>Confirmed</button>
        <button className="px-6 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#F5C518', color: '#F5C518' }}>Pending</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Your Profile</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl overflow-hidden shadow-sm border border-slate-200" style={{ color: '#1E3A5F' }}>
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg" style={{ color: '#1F2937' }}>{profile?.name}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>Patient ID: {profile?.patientId}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1F2937' }}>
                  <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {profile?.email}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1F2937' }}>
                  <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {profile?.phone}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1F2937' }}>
                  <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {profile?.location}
                </div>
              </div>
              <button onClick={onViewProfile} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium border hover:bg-slate-50 transition" style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}>Edit Profile</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6" style={subtleShadow}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Recent Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center" style={{ color: '#1E3A5F' }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <div className="flex-1"><p className="text-sm font-medium" style={{ color: '#1F2937' }}>Appointment Confirmed</p><p className="text-xs" style={{ color: '#6B7280' }}>Your checkup with Dr. Reyes is confirmed for Apr 15.</p><p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>2 hours ago</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center" style={{ color: '#F5C518' }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div className="flex-1"><p className="text-sm font-medium" style={{ color: '#1F2937' }}>Lab Results Ready</p><p className="text-xs" style={{ color: '#6B7280' }}>Your blood test results are now available.</p><p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Yesterday</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <div className="flex-1"><p className="text-sm font-medium" style={{ color: '#1F2937' }}>Prescription Ready</p><p className="text-xs" style={{ color: '#6B7280' }}>Your medication is ready for pickup.</p><p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>2 days ago</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardView;