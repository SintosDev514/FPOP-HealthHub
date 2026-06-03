import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StaffDashboardView from "./staffPages/StaffDashboardView";
import StaffDirectoryView from "./staffPages/StaffDirectoryView";
import StaffReportsView from "./staffPages/StaffReportsView";
import StaffScheduleView from "./staffPages/StaffScheduleView";
import StaffAssessmentView from "./staffPages/StaffAssessmentView";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "directory", label: "Staff Directory", icon: "users" },
  { id: "schedule", label: "Schedule", icon: "calendar" },
  { id: "reports", label: "Reports", icon: "file" },
  { id: "assessment", label: "Assessment", icon: "assessment" },
];

const NAVY_DARK = "#152c4a";
const NAVY_MID = "#1a3254";
const NAVY_LITE = "#264a77";

const StaffIcon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    home: "M3 11.5 12 4l9 7.5M5.5 10.5V20h5v-5h3v5h5v-9.5",
    users:
      "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.2.5 4 2 4 4v1M8 11c-2.2.5-4 2-4 4v1M18 8.5a3 3 0 0 1 0 5M6 8.5a3 3 0 0 0 0 5",
    calendar:
      "M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6M9 17h6",
    assessment:
      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4",
    logout:
      "M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/data", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.userData);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      console.log("Fetching staff appointments...");
      const res = await fetch("http://localhost:5000/api/appointments/staff", {
        credentials: "include",
      });
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      if (data.success) {
        console.log("Setting appointments:", data.appointments?.length);
        setAppointments(data.appointments);
      } else {
        console.error("API error:", data.message);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const stats = {
    totalStaff: profile ? 1 : 0,
    activeToday: todayAppointments.length > 0 ? 1 : 0,
    appointments: appointments.length,
    pendingReports: pendingAppointments.length,
  };

  const handleSideNav = (id) => {
    if (
      id === "schedule" ||
      id === "directory" ||
      id === "reports" ||
      id === "dashboard" ||
      id === "assessment"
    ) {
      setCurrentView(id);
      return;
    }

    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-poppins text-[#1F2937]">
      <header
        className="
          sticky top-0 z-50
          border-b border-[#F5C518]/20
          bg-[#1E3A5F]/95
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          backdrop-blur-md
          transition-all duration-300
        "
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-2"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#F5C518]/20 blur-md transition-all duration-300 group-hover:bg-[#F5C518]/30" />
                <img
                  src="/FPOPLOGO1.png"
                  alt="FPOP Clinic Portal"
                  className="relative h-14 w-14 object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-md font-bold tracking-wide text-white transition-colors duration-300 group-hover:text-[#F5C518] sm:text-lg">
                  FPOP Clinic Portal
                </h1>
                <span className="-mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#F5C518]/80">
                  Healthcare Hub
                </span>
              </div>
            </button>

            <div className="hidden items-center md:flex" />

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F5C518]/20 bg-white/5 text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white md:hidden"
            >
              {menuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#F5C518]/10 py-4 md:hidden">
              <nav className="flex flex-col gap-2">
                <div className="px-2">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#F5C518]/30 bg-[#F5C518]/95 px-4 text-sm font-bold text-[#152c4a] shadow-[0_8px_20px_rgba(245,197,24,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                  >
                    <StaffIcon name="logout" className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        <aside
          className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-[300px] shrink-0 flex-col overflow-hidden shadow-[4px_0_28px_rgba(0,0,0,0.14)] md:flex"
          style={{
            background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY_MID} 60%, ${NAVY_LITE} 100%)`,
          }}
        >
          <div className="h-[30px] border-b border-[#F5C518]/10" />
          <nav className="flex-1 py-4">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSideNav(item.id)}
                  className={`flex h-[52px] w-full items-center gap-4 border-l-[3px] px-6 text-left text-sm transition ${
                    isActive
                      ? "border-[#F5C518] bg-[#F5C518]/[0.13] font-bold text-[#F5C518]"
                      : "border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <StaffIcon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-[#F5C518]/10 p-4">
            <button
              type="button"
              onClick={logout}
              className="group flex w-full items-center gap-3 rounded-xl border border-[#F5C518]/15 bg-white/[0.06] px-4 py-3 text-left text-sm font-semibold text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:border-[#F5C518]/35 hover:bg-[#F5C518]/10 hover:text-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/35"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5C518]/10 text-[#F5C518] transition-colors duration-200 group-hover:bg-[#F5C518]/20">
                <StaffIcon name="logout" className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="leading-5">Sign out</span>
                <span className="text-xs font-medium text-white/45 transition-colors duration-200 group-hover:text-[#F5C518]/70">
                  End staff session
                </span>
              </span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSideNav(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  currentView === item.id
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-slate-100 text-[#1E3A5F]"
                }`}
              >
                <StaffIcon name={item.icon} className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {currentView === "dashboard" && (
            <StaffDashboardView
              profile={profile}
              stats={stats}
              appointments={appointments}
              onViewSchedule={() => setCurrentView("schedule")}
              onStartAssessment={() => setCurrentView("assessment")}
            />
          )}

          {currentView === "directory" && <StaffDirectoryView />}

          {currentView === "reports" && <StaffReportsView />}

          {currentView === "schedule" && (
            <StaffScheduleView
              appointments={appointments}
              onBackToDashboard={() => setCurrentView("dashboard")}
            />
          )}

          {currentView === "assessment" && <StaffAssessmentView />}

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
