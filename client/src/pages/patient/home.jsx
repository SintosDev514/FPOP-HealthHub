import React, { useEffect, useState } from "react";
import Navbar from "../../components/patient/navbar";
import AppointmentBooking from "./patientPages/AppointmentBooking";
import DashboardView from "./patientPages/DashboardView";
import MyAppointmentsView from "./patientPages/AppointmentsView";
import ProfileView from "./patientPages/ProfileView";

const CombinedDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchAppointments();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/user/data`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        const user = data.userData;
        setProfile({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          avatar: user.avatar || "",
          dateOfBirth: user.dateOfBirth || "",
          isAccountVerified: user.isAccountVerified,
          memberSince: user.createdAt,
        });
      } else {
        console.error("Failed to load user:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/appointments`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const handleEmailVerified = async () => {
    await fetchUser();
  };

  const handleSaveProfile = async (formData) => {
    try {
      const body = new FormData();
      body.append("name", formData.name || "");
      body.append("email", formData.email || "");
      body.append("phone", formData.phone || "");
      body.append("address", formData.address || "");
      body.append("dateOfBirth", formData.dateOfBirth || "");
      if (formData.avatarFile) {
        body.append("avatar", formData.avatarFile);
      }

      const res = await fetch(`${__API_BASE__}/api/user/update`, {
        method: "PUT",
        credentials: "include",
        body,
      });

      const data = await res.json();

      if (data.success) {
        const user = data.userData;
        setProfile({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          avatar: user.avatar || "",
          dateOfBirth: user.dateOfBirth || "",
          isAccountVerified: user.isAccountVerified,
          memberSince: user.createdAt,
        });
        setCurrentView("dashboard");
      } else {
        console.error("Failed to update profile:", data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        Failed to load user data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        currentView={currentView}
        profile={profile}
        onNavigateToDashboard={() => setCurrentView("dashboard")}
        onNavigateToBook={() => setCurrentView("booking")}
        onNavigateToAppointments={() => setCurrentView("appointments")}
        onNavigateToProfile={() => setCurrentView("profile")}
      />

      {currentView === "dashboard" && (
        <DashboardView
          appointments={appointments}
          profile={profile}
          onBookAppointment={() => setCurrentView("booking")}
          onViewAppointments={() => setCurrentView("appointments")}
          onViewProfile={() => setCurrentView("profile")}
          onEmailVerified={handleEmailVerified}
        />
      )}

      {currentView === "booking" && (
        <AppointmentBooking
          onBackToDashboard={() => setCurrentView("dashboard")}
          onBookAppointment={() => setCurrentView("booking")}
          onViewAppointments={() => setCurrentView("appointments")}
          onViewProfile={() => setCurrentView("profile")}
          onSaveAppointment={async () => {
            await fetchAppointments();
            setCurrentView("appointments");
          }}
        />
      )}

      {currentView === "appointments" && (
        <MyAppointmentsView
          appointments={appointments}
          onBackToDashboard={() => setCurrentView("dashboard")}
          onNavigateToBook={() => setCurrentView("booking")}
          onViewProfile={() => setCurrentView("profile")}
        />
      )}

      {currentView === "profile" && (
        <ProfileView
          profile={profile}
          appointments={appointments}
          onSaveProfile={handleSaveProfile}
          onBackToDashboard={() => setCurrentView("dashboard")}
          onNavigateToBook={() => setCurrentView("booking")}
          onViewAppointments={() => setCurrentView("appointments")}
        />
      )}
    </div>
  );
};

export default CombinedDashboard;
