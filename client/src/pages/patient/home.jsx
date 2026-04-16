
import React, { useState } from 'react';
import Navbar from '../../components/patient/navbar';
import AppointmentBooking from './patientPages/AppointmentBooking';
import DashboardView from './patientPages/DashboardView';
import MyAppointmentsView from './patientPages/AppointmentsView';
import ProfileView from './patientPages/ProfileView';

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
