import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Page Components
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import Appointments from "./Appointments";
import Analytics from "./Analytics";
import Reports from "./Reports";
import Notifications from "./Notifications";
import Settings from "./Settings";

/* ─── FPOP Brand Tokens ─────────────────────────────────────── */
const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_MID  = "#1a3254";
const NAVY_LITE = "#264a77";
const GOLD      = "#F5C518";
const GREEN     = "#22c55e";
const RED       = "#ef4444";
const PURPLE    = "#7c3aed";

/* ─── SVG Icons ─────────────────────────────────────────────── */
const IcoDash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IcoUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IcoReport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IcoBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcoGear = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IcoLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoChevron = ({ flipped }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: flipped ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IcoBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const NAV_ITEMS = [
  { key: "dashboard",     label: "Dashboard",       Icon: IcoDash,   path: "/admin" },
  { key: "users",         label: "User Management", Icon: IcoUsers,  path: "/admin/users" },
  { key: "appointments",  label: "Appointments",    Icon: IcoCal,    path: "/admin/appointments" },
  { key: "analytics",     label: "Analytics",       Icon: IcoChart,  path: "/admin/analytics" },
  { key: "reports",       label: "Reports",         Icon: IcoReport, path: "/admin/reports" },
  { key: "notifications", label: "Notifications",   Icon: IcoBell,   path: "/admin/notifications" },
  { key: "settings",      label: "Settings",        Icon: IcoGear,   path: "/admin/settings" },
];

/* ─── Admin Shell (Sidebar + Topbar) ────────────────────────── */
function AdminShell({ activeNav }) {
  const [collapsed, setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
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

      {/* Backdrop overlay for mobile sidebar */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 99,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sw, minHeight: "100vh",
        background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY_MID} 60%, ${NAVY_LITE} 100%)`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: isMobile ? (mobileOpen ? 0 : -240) : 0, bottom: 0,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        zIndex: 100, overflow: "hidden",
        boxShadow: "4px 0 28px rgba(0,0,0,0.18)",
      }}>
        {/* Brand */}
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

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map(({ key, label, Icon, path }) => {
            const active = activeNav === key;
            return (
              <button key={key} onClick={() => { navigate(path); if (isMobile) setMobileOpen(false); }} style={{
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

        {/* Back to Portal & Logout */}
        <div style={{ borderTop: "1px solid rgba(245,197,24,0.1)", padding: "12px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <button onClick={() => navigate("/home")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: (isMobile || !collapsed) ? "11px 18px" : "11px 0", justifyContent: (isMobile || !collapsed) ? "flex-start" : "center", background: "transparent", border: "none", borderLeft: "3px solid transparent", color: "rgba(255,255,255,0.6)", fontFamily: "'Poppins',sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", transition: "all 0.18s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}
          >
            <IcoBack />{(isMobile || !collapsed) && <span>Back to Portal</span>}
          </button>

          <button style={{ display: "flex", alignItems: "center", gap: "12px", padding: (isMobile || !collapsed) ? "11px 18px" : "11px 0", justifyContent: (isMobile || !collapsed) ? "flex-start" : "center", background: "transparent", border: "none", borderLeft: "3px solid transparent", color: "rgba(255,255,255,0.45)", fontFamily: "'Poppins',sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", transition: "all 0.18s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}
          >
            <IcoLogout />{(isMobile || !collapsed) && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", top: "22px", right: "-13px", width: "26px", height: "26px", borderRadius: "50%", background: NAVY_DARK, border: `1px solid rgba(245,197,24,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = NAVY; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = NAVY_DARK; }}
          >
            <IcoChevron flipped={collapsed} />
          </button>
        )}
      </aside>

      {/* Main */}
      <div style={{ marginLeft: isMobile ? 0 : sw, flex: 1, display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

        {/* Top bar */}
        <header style={{ height: "68px", background: "#fff", borderBottom: "1px solid rgba(30,58,95,0.08)", display: "flex", alignItems: "center", padding: isMobile ? "0 16px" : "0 28px", gap: "14px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(30,58,95,0.06)" }}>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: "1.5px solid rgba(30,58,95,0.12)",
                background: "#f7fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#5a6475",
                flexShrink: 0
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          <div style={{ flex: 1, maxWidth: "460px", position: "relative" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#9aa5b4", pointerEvents: "none" }}><IcoSearch /></span>
            <input id="admin-search" type="text" placeholder={isMobile ? "Search..." : "Search users, appointments, reports..."} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 16px 9px 38px", borderRadius: "24px", border: "1.5px solid rgba(30,58,95,0.12)", fontSize: "13px", color: "#333", outline: "none", background: "#f7fafc", fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(245,197,24,0.14)`; }}
              onBlur={e => { e.target.style.borderColor = "rgba(30,58,95,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          {!isMobile && <div style={{ flex: 1 }} />}

          <div style={{ position: "relative" }}>
            <button id="notifications-btn" style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(30,58,95,0.12)", background: "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#5a6475", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f7fafc"; e.currentTarget.style.color = "#5a6475"; }}>
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

        {activeNav === "dashboard" && <DashboardOverview isMobile={isMobile} />}
        {activeNav === "users" && <UserManagement isMobile={isMobile} />}
        {activeNav === "appointments" && <Appointments isMobile={isMobile} />}
        {activeNav === "analytics" && <Analytics isMobile={isMobile} />}
        {activeNav === "reports" && <Reports isMobile={isMobile} />}
        {activeNav === "notifications" && <Notifications isMobile={isMobile} />}
        {activeNav === "settings" && <Settings isMobile={isMobile} />}
      </div>
    </div>
  );
}

/* ─── Root export ───────────────────────────────────────────── */
export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminShell activeNav="dashboard" />} />
      <Route path="/users" element={<AdminShell activeNav="users" />} />
      <Route path="/appointments" element={<AdminShell activeNav="appointments" />} />
      <Route path="/analytics" element={<AdminShell activeNav="analytics" />} />
      <Route path="/reports" element={<AdminShell activeNav="reports" />} />
      <Route path="/notifications" element={<AdminShell activeNav="notifications" />} />
      <Route path="/settings" element={<AdminShell activeNav="settings" />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
