import React from "react";


const MyAppointmentsView = ({ appointments, onNavigateToBook, }) => {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-6 text-lg">You have no scheduled appointments.</p>
          <button onClick={onNavigateToBook} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition">Book an Appointment Now</button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {appointments.map(appt => (
            <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{appt.serviceName}</h3>
                  <p className="text-slate-500 font-medium mt-1">{appt.doctorName}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold shadow-sm">Pending</span>
              </div>
              <div className="flex items-center gap-4 text-slate-700 bg-slate-50 p-4 rounded-xl mt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="font-semibold">{appt.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="font-semibold">{appt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyAppointmentsView;