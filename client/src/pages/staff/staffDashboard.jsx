import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StaffDashboardView from "./staffPages/StaffDashboardView";
import StaffDirectoryView from "./staffPages/StaffDirectoryView";
import StaffReportsView from "./staffPages/StaffReportsView";
import StaffScheduleView from "./staffPages/StaffScheduleView";
import StaffAssessmentView from "./staffPages/StaffAssessmentView";
import StaffInventoryView from "./staffPages/StaffInventoryView";
import StaffAssessmentInventory from "./staffPages/StaffAssessmentInventory";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "directory", label: "Staff Directory", icon: "users" },
  { id: "schedule", label: "Schedule", icon: "calendar" },
  { id: "reports", label: "Reports", icon: "file" },
  { id: "assessment", label: "Assessment", icon: "assessment" },
  { id: "assessmentLogs", label: "Assessment Logs", icon: "clipboard" },
  { id: "inventory", label: "Inventory", icon: "inventory" },
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
    inventory:
      "m21 8-9-5-9 5m18 0-9 5m9-5v13m0-13L3 8m9 5 9-5M3 8v8l9 5 9-5V8",
    clipboard:
      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
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

function StaffNavBtn({ item, isActive, isIconOnly, onClick }) {
  const [hov, setHov] = useState(false);
  const gold = "#FFDF00";
  const bg = isActive
    ? "rgba(255,223,0,0.13)"
    : hov
    ? "rgba(255,255,255,0.07)"
    : "transparent";
  const color = isActive ? gold : hov ? "#fff" : "rgba(255,255,255,0.60)";
  const borderLeft = isActive ? `3px solid ${gold}` : "3px solid transparent";

  return (
    <button
      type="button"
      title={isIconOnly ? item.label : undefined}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: isIconOnly ? "13px 0" : "11px 18px",
        justifyContent: isIconOnly ? "center" : "flex-start",
        background: bg,
        border: "none",
        borderLeft,
        color,
        fontFamily: "'Inter', 'Poppins', sans-serif",
        fontSize: "13px",
        fontWeight: isActive ? 700 : 500,
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>
        <StaffIcon name={item.icon} />
      </span>
      {!isIconOnly && (
        <span style={{ opacity: 1, transition: "opacity 0.2s" }}>
          {item.label}
        </span>
      )}
    </button>
  );
}

function StaffLogoutBtn({ isIconOnly, logout }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      title={isIconOnly ? "Sign out" : undefined}
      onClick={logout}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: isIconOnly ? "13px 0" : "11px 18px",
        justifyContent: isIconOnly ? "center" : "flex-start",
        background: hov ? "rgba(220,38,38,0.12)" : "transparent",
        border: "none",
        borderLeft: hov ? "3px solid #DC2626" : "3px solid transparent",
        color: hov ? "#f87171" : "rgba(255,255,255,0.40)",
        fontFamily: "'Inter', 'Poppins', sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        width: "100%",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>
        <StaffIcon name="logout" />
      </span>
      {!isIconOnly && <span>Sign out</span>}
    </button>
  );
}

const StaffDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const [currentView, setCurrentViewState] = useState(viewParam || "dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [_loading, _setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Sync currentView with URL search parameter
  const setCurrentView = (viewId) => {
    setCurrentViewState(viewId);
    setSearchParams({ view: viewId }, { replace: true });
  };

  // Update currentView when URL search parameter changes
  useEffect(() => {
    if (viewParam && viewParam !== currentView) {
      setCurrentViewState(viewParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewParam]);

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const SIDEBAR_COLLAPSED = "68px";
  const SIDEBAR_EXPANDED = "260px";
  const isSidebarExpanded = !isMobile && sidebarHovered;
  const sidebarW = isMobile ? "0px" : isSidebarExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
  const isIconOnly = !isSidebarExpanded;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/user/data`, {
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
      const res = await fetch(`${__API_BASE__}/api/appointments/staff`, {
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
      _setLoading(false);
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
      id === "assessment" ||
      id === "assessmentLogs" ||
      id === "inventory"
    ) {
      setCurrentView(id);
      return;
    }

    setCurrentView("dashboard");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F9FAFB] font-poppins text-[#1F2937] flex flex-col">
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
        <div className="w-full px-4 sm:px-8 lg:px-[32px]">
          <div className="flex min-h-[48px] items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-2"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#F5C518]/20 blur-md transition-all duration-300 group-hover:bg-[#F5C518]/30" />
                <img
                  src="/logoo.png"
                  alt="FPOP Clinic Portal"
                  className="relative h-12 w-12 object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-xs font-bold tracking-wide text-white transition-colors duration-300 group-hover:text-[#F5C518] sm:text-sm">
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

      <div style={{ height: "calc(100vh - 48px)", position: "relative", display: "flex", overflow: "hidden" }}>
        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• SIDEBAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <aside
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          className="hidden md:block"
          style={{
            width: sidebarW,
            position: "fixed",
            top: "48px",
            left: 0,
            bottom: 0,
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY_MID} 55%, ${NAVY_LITE} 100%)`,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            boxShadow: "4px 0 32px rgba(21,44,74,0.22)",
          }}
        >
          {/* â”€â”€ Brand logo â”€â”€ */}
          <div
            style={{
              padding: isIconOnly ? "20px 0" : "20px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              minHeight: "72px",
              justifyContent: isIconOnly ? "center" : "flex-start",
              overflow: "hidden",
            }}
          >
            <img
              src="/logoo.png"
              alt="FPOP Logo"
              style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }}
            />
            {!isIconOnly && (
              <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ fontWeight: 800, fontSize: "14px", color: "#fff", lineHeight: 1.2 }}>
                  FPOP Staff
                </div>
                <div style={{ fontSize: "10px", color: "#FFDF00", textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.9 }}>
                  Healthcare Hub
                </div>
              </div>
            )}
          </div>

          {/* â”€â”€ Section label â”€â”€ */}
          {!isIconOnly && (
            <div style={{ padding: "16px 18px 6px", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.2px", whiteSpace: "nowrap" }}>
              Main Menu
            </div>
          )}

          {/* â”€â”€ Navigation links â”€â”€ */}
          <nav style={{ flex: 1, padding: "8px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
            {navItems.map((item) => (
              <StaffNavBtn
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                isIconOnly={isIconOnly}
                onClick={() => handleSideNav(item.id)}
              />
            ))}
          </nav>

          {/* â”€â”€ Divider â”€â”€ */}
          <div style={{ margin: "0 12px", height: "1px", background: "rgba(255,255,255,0.07)" }} />

          {/* â”€â”€ Bottom: Logout â”€â”€ */}
          <div style={{ padding: "10px 0 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
            <StaffLogoutBtn isIconOnly={isIconOnly} logout={logout} />
          </div>

          {/* â”€â”€ Sidebar footer watermark â”€â”€ */}
          {!isIconOnly && (
            <div style={{ padding: "10px 18px 16px", fontSize: "10px", color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", fontStyle: "italic" }}>
              Â© 2025 FPOP HealthHub System
            </div>
          )}
        </aside>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN CONTENT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          style={{
            marginLeft: sidebarW,
            width: `calc(100% - ${sidebarW})`,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            minWidth: 0,
            overflowY: "auto",
          }}
        >
          <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            {navItems.map((item) => (
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
              onRefresh={fetchAppointments}
              onBackToDashboard={() => setCurrentView("dashboard")}
            />
          )}

          {currentView === "assessment" && <StaffAssessmentView />}

          {currentView === "assessmentLogs" && <StaffAssessmentInventory />}

          {currentView === "inventory" && <StaffInventoryView />}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
