
import React, { useState } from 'react';
import logo from '../assets/logo.png';


const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ---------- Reusable Navbar ----------
const Navbar = ({ currentView, onNavigateToDashboard, onNavigateToBook, onNavigateToAppointments, onNavigateToProfile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#1E3A5F' }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-0.5">
            <img src={logo} alt="FPOP Clinic Portal Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold text-white">FPOP Clinic</h1>
          </div>

          {

          }
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button onClick={onNavigateToDashboard} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${currentView === 'dashboard' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>Dashboard</span>
            </button>
            <button onClick={onNavigateToBook} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${currentView === 'booking' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Book Appointment</span>
            </button>
            <button onClick={onNavigateToAppointments} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${currentView === 'appointments' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>My Appointments</span>
            </button>
            <button onClick={onNavigateToProfile} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${currentView === 'profile' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Profile</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-4">
              <button className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#F5C518' }}></span>
              </button>
              <button className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>

            <button
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-2 space-y-1">
            <button onClick={() => { onNavigateToDashboard(); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${currentView === 'dashboard' ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>Dashboard</span>
            </button>
            <button onClick={() => { onNavigateToBook(); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${currentView === 'booking' ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Book Appointment</span>
            </button>
            <button onClick={() => { onNavigateToAppointments(); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${currentView === 'appointments' ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>My Appointments</span>
            </button>
            <button onClick={() => { onNavigateToProfile(); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${currentView === 'profile' ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 transition pt-4 mt-2 border-t border-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const AppointmentBooking = ({ onBackToDashboard, onBookAppointment, onViewAppointments, onViewProfile, onSaveAppointment }) => {
  const services = [
    { id: "general", name: "General Consultation", duration: "30 min", price: "$50" },
    { id: "family", name: "Family Planning", duration: "45 min", price: "$80" },
    { id: "prenatal", name: "Prenatal Care", duration: "60 min", price: "$100" }
  ];

  const screeningOption = { id: "screening", name: "Health Screening", duration: "30 min", price: "$40" };

  const [selectedService, setSelectedService] = useState(null);
  const [includeScreening, setIncludeScreening] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const calendarDays = getDaysInMonth(currentMonthDate);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM"
  ];
  const screeningTimes = ["02:00 PM", "02:30 PM"];

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleConfirm = () => {
    if (!selectedService) return alert("Please select a service");
    if (!selectedDate) return alert("Please select a date");
    if (!selectedTime) return alert("Please select a time");

    if (onSaveAppointment) {
      onSaveAppointment({
        id: Date.now(),
        serviceId: selectedService,
        serviceName: [...services, screeningOption].find(s => s.id === selectedService)?.name,
        doctorName: "Assigned Doctor",
        date: selectedDate,
        time: selectedTime,
      });
    } else {
      alert("Booking confirmed! (Demo)");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-gray-600">Choose your preferred date, time, and service</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Service</h2>
            </div>
            <div className="p-4 space-y-2">
              {[...services, screeningOption].map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setIncludeScreening(service.id === screeningOption.id);
                    setSelectedTime(null);
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-all ${selectedService === service.id
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-blue-300"
                    }`}
                >
                  <div className="font-semibold text-sm text-slate-900">{service.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{service.duration}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Date</h2>
              <div className="flex items-center text-slate-700 bg-white rounded-xl shadow-sm border border-slate-200 p-0.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="w-24 text-center text-xs font-semibold text-slate-800 px-1">
                  {currentMonthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-4">
                {weekdays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-400">{day.substring(0, 2)}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {calendarDays.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-8 w-8 mx-auto"></div>;
                  }

                  const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                  const isPast = date < new Date().setHours(0, 0, 0, 0);

                  return (
                    <button
                      key={idx}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs transition-all ${isSelected
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : isPast
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-700 hover:bg-blue-50"
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Time</h2>
              <ClockIcon />
            </div>
            <div className="p-4">
              <div className="max-h-[300px] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  {(includeScreening ? screeningTimes : timeSlots).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${selectedTime === time
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-500"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#1E3A5F] mb-6">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Service</p>
                <p className="text-base font-medium text-slate-900">
                  {selectedService ? [...services, screeningOption].find(s => s.id === selectedService)?.name : "Not selected"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="text-base font-medium text-slate-900">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Time</p>
                <p className="text-base font-medium text-slate-900">
                  {selectedTime || "Not selected"}
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedService || !selectedDate || !selectedTime}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition shadow-sm text-center ${selectedService && selectedDate && selectedTime
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#cbd5e1] text-white cursor-not-allowed"
                }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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



// ---------- My Appointments View ----------
const MyAppointmentsView = ({ appointments, onBackToDashboard, onNavigateToBook, onViewProfile }) => {
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

// ---------- Profile View ----------
const ProfileView = ({ profile, onSaveProfile, onBackToDashboard, onNavigateToBook, onViewAppointments }) => {
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-[#F5C518] rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 transition-transform" onClick={() => {
                const url = prompt("Enter image URL for your profile picture:", formData.avatar || "https://i.pravatar.cc/150?u=sarah");
                if (url) setFormData({ ...formData, avatar: url });
              }}>
                <svg className="w-4 h-4 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">Click icon to change picture</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">Save Changes</button>
          </div>
        </form>
      </div>
    </main>
  );
};

const CombinedDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    patientId: "P12345",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA"
  });
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      serviceName: "Family Planning Consultation",
      doctorName: "Dr. Sarah Johnson",
      date: new Date(2026, 3, 5),
      time: "10:00 AM"
    },
    {
      id: 2,
      serviceName: "General Checkup",
      doctorName: "Dr. Michael Chen",
      date: new Date(2026, 3, 12),
      time: "02:30 PM"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigateToDashboard={() => setCurrentView('dashboard')}
        onNavigateToBook={() => setCurrentView('booking')}
        onNavigateToAppointments={() => setCurrentView('appointments')}
        onNavigateToProfile={() => setCurrentView('profile')}
      />
      {currentView === 'dashboard' && (
        <DashboardView
          appointments={appointments}
          profile={profile}
          onBookAppointment={() => setCurrentView('booking')}
          onViewAppointments={() => setCurrentView('appointments')}
          onViewProfile={() => setCurrentView('profile')}
        />
      )}
      {currentView === 'booking' && (
        <AppointmentBooking
          onBackToDashboard={() => setCurrentView('dashboard')}
          onBookAppointment={() => setCurrentView('booking')}
          onViewAppointments={() => setCurrentView('appointments')}
          onViewProfile={() => setCurrentView('profile')}
          onSaveAppointment={(appt) => {
            setAppointments([...appointments, appt]);
            setCurrentView('appointments');
          }}
        />
      )}
      {currentView === 'appointments' && (
        <MyAppointmentsView
          appointments={appointments}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onNavigateToBook={() => setCurrentView('booking')}
          onViewProfile={() => setCurrentView('profile')}
        />
      )}
      {currentView === 'profile' && (
        <ProfileView
          profile={profile}
          onSaveProfile={(updatedProfile) => {
            setProfile(updatedProfile);
            setCurrentView('dashboard');
          }}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onNavigateToBook={() => setCurrentView('booking')}
          onViewAppointments={() => setCurrentView('appointments')}
        />
      )}
    </div>
  );
};

export default CombinedDashboard;
