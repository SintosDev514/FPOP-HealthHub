import React, { useState } from 'react';
import logo from '../../assets/logo.png';

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

export default Navbar;
