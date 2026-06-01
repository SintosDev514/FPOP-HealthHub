import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StaffDashboardView from "./staffPages/StaffDashboardView";
import StaffDirectoryView from "./staffPages/StaffDirectoryView";
import StaffReportsView from "./staffPages/StaffReportsView";
import StaffScheduleView from "./staffPages/StaffScheduleView";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "directory", label: "Staff Directory", icon: "users" },
  { id: "schedule", label: "Schedule", icon: "calendar" },
  { id: "reports", label: "Reports", icon: "file" },
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile] = useState({
    name: "Dr. John Smith",
    staffId: "S12345",
    email: "john.smith@hospital.com",
    phone: "+1 (555) 987-6543",
    department: "Cardiology",
    position: "Senior Doctor",
    avatar: "https://i.pravatar.cc/150?u=john",
    licenseId: "MD-12345",
    specialization: "Cardiothoracic Surgery",
    bio: "Experienced cardiologist with 15+ years in patient care and surgical interventions.",
  });

  const [stats] = useState({
    totalStaff: 248,
    activeToday: 186,
    appointments: 42,
    pendingReports: 8,
    todayShifts: 8,
    attendanceRate: 96,
    completedTasks: 42,
    pendingTasks: 5,
  });

  const handleSideNav = (id) => {
    if (
      id === "schedule" ||
      id === "directory" ||
      id === "reports" ||
      id === "dashboard"
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
                    className="h-11 w-full rounded-full border border-[#F5C518] bg-[#F5C518] text-sm font-bold text-[#1E3A5F] shadow-[0_4px_14px_rgba(245,197,24,0.2)] transition-all duration-300 hover:bg-white hover:text-[#1E3A5F]"
                  >
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        <aside
          className="hidden min-h-[calc(100vh-76px)] w-[300px] shrink-0 flex-col overflow-hidden shadow-[4px_0_28px_rgba(0,0,0,0.14)] md:flex"
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
          <div className="border-t border-[#F5C518]/10 py-3">
            <button
              type="button"
              onClick={logout}
              className="flex h-[52px] w-full items-center gap-4 border-l-[3px] border-transparent px-6 text-left text-sm font-medium text-white/50 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
              </svg>
              Logout
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
              onViewSchedule={() => setCurrentView("schedule")}
              onViewProfile={() => setCurrentView("directory")}
            />
          )}

          {currentView === "directory" && <StaffDirectoryView />}

          {currentView === "reports" && <StaffReportsView />}

          {currentView === "schedule" && (
            <StaffScheduleView
              profile={profile}
              onBackToDashboard={() => setCurrentView("dashboard")}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
