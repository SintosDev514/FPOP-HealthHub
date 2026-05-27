import React, { useState } from 'react';
import Navbar from '../../components/patient/navbar';
import StaffDashboardView from './staffPages/StaffDashboardView';
import StaffScheduleView from './staffPages/StaffScheduleView';
import StaffProfileView from './staffPages/StaffProfileView';

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profile, setProfile] = useState({
    name: "Dr. John Smith",
    staffId: "S12345",
    email: "john.smith@hospital.com",
    phone: "+1 (555) 987-6543",
    department: "Cardiology",
    position: "Senior Doctor",
    avatar: "https://i.pravatar.cc/150?u=john",
    licenseId: "MD-12345",
    specialization: "Cardiothoracic Surgery",
    bio: "Experienced cardiologist with 15+ years in patient care and surgical interventions."
  });

  const [stats] = useState({
    todayShifts: 8,
    attendanceRate: 96,
    completedTasks: 42,
    pendingTasks: 5
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigateToDashboard={() => setCurrentView('dashboard')}
        onNavigateToBook={() => setCurrentView('schedule')}
        onNavigateToAppointments={() => setCurrentView('schedule')}
        onNavigateToProfile={() => setCurrentView('profile')}
      />

      {currentView === 'dashboard' && (
        <StaffDashboardView
          profile={profile}
          stats={stats}
          onViewSchedule={() => setCurrentView('schedule')}
          onViewProfile={() => setCurrentView('profile')}
        />
      )}

      {currentView === 'schedule' && (
        <StaffScheduleView
          profile={profile}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'profile' && (
        <StaffProfileView
          profile={profile}
          onSaveProfile={(updatedProfile) => {
            setProfile(updatedProfile);
            setCurrentView('dashboard');
          }}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
