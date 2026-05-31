import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import Appointments from "./Appointments";
import Analytics from "./Analytics";
import Reports from "./Reports";
import Notifications from "./Notifications";
import Settings from "./Settings";

import {
  IcoDash, IcoUsers, IcoCal, IcoChart, IcoReport,
  IcoBell, IcoGear, IcoLogout, IcoSearch,
  IcoChevron, IcoBack, IcoHamburger
} from "../../../components/icon/AdminIcons";

const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_MID  = "#1a3254";
const NAVY_LITE = "#264a77";
const GOLD      = "#F5C518";
const GREEN     = "#22c55e";
const RED       = "#ef4444";

const NAV_ITEMS = [
  { key: "dashboard",    label: "Dashboard",       Icon: IcoDash,   path: "/admin" },
  { key: "users",        label: "User Management", Icon: IcoUsers,  path: "/admin/users" },
  { key: "appointments", label: "Appointments",    Icon: IcoCal,    path: "/admin/appointments" },
  { key: "analytics",    label: "Analytics",       Icon: IcoChart,  path: "/admin/analytics" },
  { key: "reports",      label: "Reports",         Icon: IcoReport, path: "/admin/reports" },
];

function AdminShell({ activeNav }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile]    = useState(false);
  const [search, setSearch]        = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpanded = !isMobile && isHovered;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins',sans-serif", backgroundColor: "#f9fafb" }}>

      {/* ── Sidebar Styles Injection ── */}
      <style>{`
        /* Sidebar Container */
        .admin-sidebar {
          width: 72px;
          min-height: 100vh;
          background: linear-gradient(180deg, #152c4a 0%, #1a3254 60%, #264a77 100%);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          overflow: hidden;
          box-shadow: 4px 0 28px rgba(0, 0, 0, 0.18);
          border-right: none;
          box-sizing: border-box;
        }

        .admin-sidebar.expanded {
          width: 240px;
        }

        /* Brand container */
        .admin-sidebar-brand {
          padding: 16px 17px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(245, 197, 24, 0.14);
          min-height: 72px;
          overflow: hidden;
          box-sizing: border-box;
          background-color: transparent;
          flex-shrink: 0;
        }

        /* Brand details */
        .admin-sidebar-brand-text {
          display: flex;
          flex-direction: column;
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          visibility: hidden;
          white-space: nowrap;
        }

        .admin-sidebar.expanded .admin-sidebar-brand-text {
          opacity: 1;
          visibility: visible;
        }

        /* Navigation items container */
        .admin-sidebar-nav {
          flex: 1;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* Nav Link Button */
        .admin-sidebar-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 27px;
          background: transparent;
          border: none;
          border-left: 4px solid transparent;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Hover state for nav item */
        .admin-sidebar-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        /* Active state for nav item */
        .admin-sidebar-item.active {
          background-color: rgba(245, 197, 24, 0.13);
          border-left-color: #F5C518; /* Gold accent */
          color: #F5C518; /* Gold text */
          font-weight: 600;
        }

        /* Icon style wrapper */
        .admin-sidebar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          color: inherit;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Hover animation for icon inside nav item */
        .admin-sidebar-item:hover .admin-sidebar-icon {
          transform: translateX(3px) scale(1.08);
          color: #ffffff;
        }

        /* Active state icon */
        .admin-sidebar-item.active .admin-sidebar-icon {
          color: #F5C518;
          transform: scale(1.05);
        }

        /* Label text container */
        .admin-sidebar-label {
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          visibility: hidden;
          font-family: 'Poppins', sans-serif;
        }

        .admin-sidebar.expanded .admin-sidebar-label {
          opacity: 1;
          visibility: visible;
        }

        /* Bottom Logout actions */
        .admin-sidebar-footer {
          border-top: 1px solid rgba(245, 197, 24, 0.1);
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-shrink: 0;
        }

        .admin-sidebar-logout {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 27px;
          background: transparent;
          border: none;
          border-left: 4px solid transparent;
          color: rgba(255, 255, 255, 0.45);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          overflow: hidden;
          box-sizing: border-box;
        }

        .admin-sidebar-logout:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #f87171; /* red-ish */
        }

        .admin-sidebar-logout:hover .admin-sidebar-icon {
          transform: scale(1.08) translateX(3px);
          color: #f87171;
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar ${isExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo / Brand */}
        <div className="admin-sidebar-brand">
          <img
            src="/FPOPLOGO1.png"
            alt="FPOP Logo"
            style={{ width: "38px", height: "38px", objectFit: "contain", flexShrink: 0 }}
          />
          <div className="admin-sidebar-brand-text">
            <span style={{ fontWeight: 800, fontSize: "14px", color: "#ffffff", lineHeight: 1.2 }}>FPOP Admin</span>
            <span style={{ fontSize: "10px", color: "#F5C518", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>HealthHub</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map(({ key, label, Icon, path }) => {
            const active = activeNav === key;
            return (
              <button
                key={key}
                onClick={() => navigate(path)}
                title={!isExpanded ? label : undefined}
                className={`admin-sidebar-item ${active ? "active" : ""}`}
              >
                <span className="admin-sidebar-icon">
                  <Icon />
                </span>
                <span className="admin-sidebar-label">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="admin-sidebar-footer">
          <button
            title={!isExpanded ? "Logout" : undefined}
            className="admin-sidebar-logout"
          >
            <span className="admin-sidebar-icon">
              <IcoLogout />
            </span>
            <span className="admin-sidebar-label">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ marginLeft: "72px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        <header style={{ height: "68px", background: "#fff", borderBottom: "1px solid rgba(30,58,95,0.08)", display: "flex", alignItems: "center", padding: isMobile ? "0 16px" : "0 28px", gap: "10px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(30,58,95,0.06)" }}>

          {/* Search bar */}
          <div style={{ position: "relative", width: isMobile ? "160px" : "300px" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#9aa5b4", pointerEvents: "none" }}>
              <IcoSearch />
            </span>
            <input
              id="admin-search"
              type="text"
              placeholder={isMobile ? "Search..." : "Search..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 16px 9px 38px", borderRadius: "24px", border: "1.5px solid rgba(30,58,95,0.12)", fontSize: "13px", color: "#333", outline: "none", background: "#f7fafc", fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(245,197,24,0.14)`; }}
              onBlur={e => { e.target.style.borderColor = "rgba(30,58,95,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Spacer pushes user profile and actions to the right */}
          <div style={{ flex: 1 }} />

          {/* Notification bell — navigates to /admin/notifications */}
          <div style={{ position: "relative" }}>
            <button
              id="notifications-btn"
              title="Notifications"
              onClick={() => navigate("/admin/notifications")}
              style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(30,58,95,0.12)", background: activeNav === "notifications" ? NAVY : "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: activeNav === "notifications" ? "#fff" : "#5a6475", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = activeNav === "notifications" ? NAVY : "#f7fafc"; e.currentTarget.style.color = activeNav === "notifications" ? "#fff" : "#5a6475"; }}
            >
              <IcoBell />
            </button>
            <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "17px", height: "17px", borderRadius: "50%", background: RED, color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>2</span>
          </div>

          {/* Settings gear — navigates to /admin/settings */}
          <button
            id="settings-btn"
            title="Settings"
            onClick={() => navigate("/admin/settings")}
            style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(30,58,95,0.12)", background: activeNav === "settings" ? NAVY : "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: activeNav === "settings" ? "#fff" : "#5a6475", transition: "all 0.2s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = activeNav === "settings" ? NAVY : "#f7fafc"; e.currentTarget.style.color = activeNav === "settings" ? "#fff" : "#5a6475"; }}
          >
            <IcoGear />
          </button>

          {/* Admin avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "10px", borderLeft: "1px solid rgba(30,58,95,0.1)", cursor: "pointer" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_LITE})`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 800, fontSize: "15px", border: `2px solid ${GOLD}33`, flexShrink: 0 }}>A</div>
            {!isMobile && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: NAVY, lineHeight: 1.2, whiteSpace: "nowrap" }}>Admin User</div>
                <div style={{ fontSize: "10px", color: "#9aa5b4" }}>Administrator</div>
              </div>
            )}
          </div>
        </header>

        {activeNav === "dashboard"     && <DashboardOverview isMobile={isMobile} />}
        {activeNav === "users"         && <UserManagement    isMobile={isMobile} />}
        {activeNav === "appointments"  && <Appointments      isMobile={isMobile} />}
        {activeNav === "analytics"     && <Analytics         isMobile={isMobile} />}
        {activeNav === "reports"       && <Reports           isMobile={isMobile} />}
        {activeNav === "notifications" && <Notifications     isMobile={isMobile} />}
        {activeNav === "settings"      && <Settings          isMobile={isMobile} />}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/"             element={<AdminShell activeNav="dashboard" />} />
      <Route path="/users"        element={<AdminShell activeNav="users" />} />
      <Route path="/appointments" element={<AdminShell activeNav="appointments" />} />
      <Route path="/analytics"    element={<AdminShell activeNav="analytics" />} />
      <Route path="/reports"      element={<AdminShell activeNav="reports" />} />
      <Route path="/notifications"element={<AdminShell activeNav="notifications" />} />
      <Route path="/settings"     element={<AdminShell activeNav="settings" />} />
      <Route path="*"             element={<Navigate to="" replace />} />
    </Routes>
  );
}
