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
  { key: "dashboard",     label: "Dashboard",       Icon: IcoDash,   path: "/admin" },
  { key: "users",         label: "User Management", Icon: IcoUsers,  path: "/admin/users" },
  { key: "appointments",  label: "Appointments",    Icon: IcoCal,    path: "/admin/appointments" },
  { key: "analytics",     label: "Analytics",       Icon: IcoChart,  path: "/admin/analytics" },
  { key: "reports",       label: "Reports",         Icon: IcoReport, path: "/admin/reports" },
  { key: "notifications", label: "Notifications",   Icon: IcoBell,   path: "/admin/notifications" },
  { key: "settings",      label: "Settings",        Icon: IcoGear,   path: "/admin/settings" },
];

function AdminShell({ activeNav }) {
  const [collapsed, setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]    = useState(false);
  const [search, setSearch]        = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sw = isMobile ? 240 : (collapsed ? 72 : 240);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins',sans-serif" }}>

      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 99,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      <aside style={{
        width: sw, minHeight: "100vh",
        background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY_MID} 60%, ${NAVY_LITE} 100%)`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: isMobile ? (mobileOpen ? 0 : -240) : 0, bottom: 0,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        zIndex: 100, overflow: "hidden",
        boxShadow: "4px 0 28px rgba(0,0,0,0.18)",
      }}>
        <div style={{ padding: (isMobile || !collapsed) ? "20px 18px" : "20px 0", display: "flex", alignItems: "center", gap: "10px", borderBottom: `1px solid rgba(245,197,24,0.14)`, minHeight: "72px", justifyContent: (isMobile || !collapsed) ? "flex-start" : "center" }}>
          <img
            src="/FPOPLOGO1.png"
            alt="FPOP Logo"
            style={{ width: "38px", height: "38px", objectFit: "contain", flexShrink: 0 }}
          />
          {(isMobile || !collapsed) && (
            <div>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#fff", lineHeight: 1.2 }}>FPOP Admin</div>
              <div style={{ fontSize: "10px", color: GOLD, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.6px" }}>HealthHub</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "14px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map(({ key, label, Icon, path }) => {
            const active = activeNav === key;
            return (
              <button
                key={key}
                onClick={() => { navigate(path); if (isMobile) setMobileOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: (isMobile || !collapsed) ? "11px 18px" : "11px 0",
                  justifyContent: (isMobile || !collapsed) ? "flex-start" : "center",
                  background: active ? "rgba(245,197,24,0.13)" : "transparent",
                  border: "none", borderLeft: active ? `3px solid ${GOLD}` : "3px solid transparent",
                  color: active ? GOLD : "rgba(255,255,255,0.6)",
                  fontFamily: "'Poppins',sans-serif", fontSize: "13px", fontWeight: active ? 700 : 500,
                  cursor: "pointer", width: "100%", textAlign: "left",
                  transition: "all 0.18s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
              >
                <span style={{ flexShrink: 0 }}><Icon /></span>
                {(isMobile || !collapsed) && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid rgba(245,197,24,0.1)", padding: "12px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <button
            onClick={() => navigate("/home")}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: (isMobile || !collapsed) ? "11px 18px" : "11px 0", justifyContent: (isMobile || !collapsed) ? "flex-start" : "center", background: "transparent", border: "none", borderLeft: "3px solid transparent", color: "rgba(255,255,255,0.6)", fontFamily: "'Poppins',sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", transition: "all 0.18s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}
          >
            <IcoBack />{(isMobile || !collapsed) && <span>Back to Portal</span>}
          </button>

          <button
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: (isMobile || !collapsed) ? "11px 18px" : "11px 0", justifyContent: (isMobile || !collapsed) ? "flex-start" : "center", background: "transparent", border: "none", borderLeft: "3px solid transparent", color: "rgba(255,255,255,0.45)", fontFamily: "'Poppins',sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", transition: "all 0.18s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}
          >
            <IcoLogout />{(isMobile || !collapsed) && <span>Logout</span>}
          </button>
        </div>

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ position: "absolute", top: "22px", right: "-13px", width: "26px", height: "26px", borderRadius: "50%", background: NAVY_DARK, border: `1px solid rgba(245,197,24,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = NAVY; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = NAVY_DARK; }}
          >
            <IcoChevron flipped={collapsed} />
          </button>
        )}
      </aside>

      <div style={{ marginLeft: isMobile ? 0 : sw, flex: 1, display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

        <header style={{ height: "68px", background: "#fff", borderBottom: "1px solid rgba(30,58,95,0.08)", display: "flex", alignItems: "center", padding: isMobile ? "0 16px" : "0 28px", gap: "14px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(30,58,95,0.06)" }}>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                width: "38px", height: "38px", borderRadius: "50%",
                border: "1.5px solid rgba(30,58,95,0.12)", background: "#f7fafc",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#5a6475", flexShrink: 0
              }}
            >
              <IcoHamburger />
            </button>
          )}

          <div style={{ flex: 1, maxWidth: "460px", position: "relative" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#9aa5b4", pointerEvents: "none" }}>
              <IcoSearch />
            </span>
            <input
              id="admin-search"
              type="text"
              placeholder={isMobile ? "Search..." : "Search users, appointments, reports..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 16px 9px 38px", borderRadius: "24px", border: "1.5px solid rgba(30,58,95,0.12)", fontSize: "13px", color: "#333", outline: "none", background: "#f7fafc", fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(245,197,24,0.14)`; }}
              onBlur={e => { e.target.style.borderColor = "rgba(30,58,95,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          {!isMobile && <div style={{ flex: 1 }} />}

          <div style={{ position: "relative" }}>
            <button
              id="notifications-btn"
              style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(30,58,95,0.12)", background: "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#5a6475", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f7fafc"; e.currentTarget.style.color = "#5a6475"; }}
            >
              <IcoBell />
            </button>
            <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "17px", height: "17px", borderRadius: "50%", background: RED, color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>2</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "12px", borderLeft: "1px solid rgba(30,58,95,0.1)", cursor: "pointer" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_LITE})`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 800, fontSize: "15px", border: `2px solid ${GOLD}33` }}>A</div>
            {!isMobile && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>Admin User</div>
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
