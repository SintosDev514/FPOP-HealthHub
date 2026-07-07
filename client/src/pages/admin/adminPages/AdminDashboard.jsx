import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";

import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import StaffManagement from "./StaffManagement";
import Appointments from "./Appointments";
import AdminInventoryView from "./AdminInventoryView";
import Analytics from "./Analytics";
import Reports from "./Reports";
import Notifications from "./Notifications";
import Settings from "./Settings";

import { useAuth } from "../../../context/AuthContext";

import {
  IcoDash,
  IcoCal,
  IcoChart,
  IcoReport,
  IcoBell,
  IcoGear,
  IcoLogout,
  IcoSearch,
  IcoStaff,
  IcoClient,
  IcoInventory,
} from "../../../components/icon/AdminIcons";

/* ── Brand palette ──────────────────────────────── */
const GOLD      = "#FFDF00"; // Yellow accent for active links
const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_MID  = "#1a3254";
const NAVY_LITE = "#264a77";
const RED       = "#DC2626";
const RED_DARK  = "#b91c1c";
const RED_SOFT  = "#fee2e2";

const SIDEBAR_COLLAPSED = "68px";
const SIDEBAR_EXPANDED  = "260px";

const NAV_ITEMS = [
  { key: "dashboard",    label: "Dashboard",         Icon: IcoDash,   path: "/admin"              },
  { key: "users",        label: "Client Management",  Icon: IcoClient,  path: "/admin/users"         },
  { key: "staff",        label: "Staff Management",   Icon: IcoStaff,  path: "/admin/staff"         },
  { key: "appointments", label: "Appointments",       Icon: IcoCal,    path: "/admin/appointments"  },
  { key: "inventory",    label: "Inventory",          Icon: IcoInventory, path: "/admin/inventory"  },
  { key: "analytics",   label: "Analytics",          Icon: IcoChart,  path: "/admin/analytics"     },
  { key: "reports",     label: "Reports",             Icon: IcoReport, path: "/admin/reports"       },
];

/* ── Sidebar nav button ─────────────────────────── */
function NavBtn({ item, active, isIconOnly }) {
  const [hov, setHov] = useState(false);

  const bg = active
    ? "rgba(255,223,0,0.13)"
    : hov
    ? "rgba(255,255,255,0.07)"
    : "transparent";

  const color = active ? GOLD : hov ? "#fff" : "rgba(255,255,255,0.60)";
  const borderLeft = active ? `3px solid ${GOLD}` : "3px solid transparent";

  return (
    <Link
      to={item.path}
      title={isIconOnly ? item.label : undefined}
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
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>
        <item.Icon />
      </span>
      {!isIconOnly && <span style={{ opacity: 1, transition: "opacity 0.2s" }}>{item.label}</span>}
    </Link>
  );
}

/* ── Header icon button ─────────────────────────── */
function HeaderIconBtn({ id, title, onClick, isActive, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        border: isActive
          ? `1.5px solid ${NAVY}`
          : hov
          ? `1.5px solid rgba(30,58,95,0.3)`
          : "1.5px solid rgba(30,58,95,0.1)",
        background: isActive ? NAVY : hov ? "rgba(30,58,95,0.06)" : "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: isActive ? "#fff" : hov ? NAVY : "#64748b",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ── Main shell ─────────────────────────────────── */
function AdminShell({ activeNav }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [search,    setSearch]    = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Sidebar is ALWAYS collapsed by default; expands only while hovered */
  const isExpanded = !isMobile && isHovered;
  const sidebarW   = isMobile ? "0px" : isExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
  const isIconOnly = !isMobile && !isExpanded;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', 'Poppins', sans-serif" }}>

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: sidebarW,
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY_MID} 55%, ${NAVY_LITE} 100%)`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 100,
          overflow: "hidden",
          boxShadow: "4px 0 32px rgba(21,44,74,0.22)",
        }}
      >
        {/* ── Brand logo ── */}
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
            src="/FPOPLOGO1.png"
            alt="FPOP Logo"
            style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }}
          />
          {!isIconOnly && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#fff", lineHeight: 1.2 }}>
                FPOP Admin
              </div>
                <div style={{ fontSize: "10px", color: GOLD, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.9 }}>
                HealthHub
              </div>
            </div>
          )}
        </div>

        {/* ── Section label ── */}
        {!isIconOnly && (
          <div style={{ padding: "16px 18px 6px", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.2px", whiteSpace: "nowrap" }}>
            Main Menu
          </div>
        )}

        {/* ── Navigation links ── */}
        <nav style={{ flex: 1, padding: "8px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map((item) => (
            <NavBtn
              key={item.key}
              item={item}
              active={activeNav === item.key}
              isIconOnly={isIconOnly}
            />
          ))}
        </nav>

        {/* ── Divider ── */}
        <div style={{ margin: "0 12px", height: "1px", background: "rgba(255,255,255,0.07)" }} />

        {/* ── Bottom: Logout ── */}
        <div style={{ padding: "10px 0 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <LogoutBtn isIconOnly={isIconOnly} logout={logout} />
        </div>

        {/* ── Sidebar footer watermark ── */}
        {!isIconOnly && (
          <div style={{ padding: "10px 18px 16px", fontSize: "10px", color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", fontStyle: "italic" }}>
            © 2025 FPOP HealthHub System
          </div>
        )}
      </aside>

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <div
        style={{
          marginLeft: sidebarW,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100vh",
          minWidth: 0,
          overflow: "hidden",
          background: "#f1f5f9",
        }}
      >
        {/* ════ HEADER ════ */}
        <header
          style={{
            height: "68px",
            background: "#ffffff",
            borderBottom: "1px solid rgba(30,58,95,0.08)",
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 28px",
            gap: "12px",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 2px 16px rgba(30,58,95,0.07)",
          }}
        >
          {/* ── Search bar — LEFT ── */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "180px" : "380px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
                lineHeight: 0,
              }}
            >
              <IcoSearch />
            </span>
            <input
              id="admin-search"
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                borderRadius: "10px",
                border: "1.5px solid rgba(30,58,95,0.10)",
                fontSize: "13.5px",
                color: "#1e293b",
                outline: "none",
                background: "#f8fafc",
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = NAVY;
                e.target.style.boxShadow = `0 0 0 3px rgba(30,58,95,0.10)`;
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(30,58,95,0.10)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#f8fafc";
              }}
            />
          </div>

          {/* ── Spacer ── */}
          <div style={{ flex: 1 }} />

          {/* ── RIGHT SIDE: notification + settings + profile ── */}

          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <HeaderIconBtn
              id="notifications-btn"
              title="Notifications"
              onClick={() => navigate("/admin/notifications")}
              isActive={activeNav === "notifications"}
            >
              <IcoBell />
            </HeaderIconBtn>
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: RED,
                color: "#fff",
                fontSize: "10px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
                boxShadow: "0 2px 6px rgba(220,38,38,0.4)",
              }}
            >
              2
            </span>
          </div>

          {/* Settings */}
          <HeaderIconBtn
            id="settings-btn"
            title="Settings"
            onClick={() => navigate("/admin/settings")}
            isActive={activeNav === "settings"}
          >
            <IcoGear />
          </HeaderIconBtn>

          {/* Profile divider */}
          <div style={{ width: "1px", height: "32px", background: "rgba(30,58,95,0.10)", flexShrink: 0 }} />

          {/* Admin avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_LITE})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "15px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(30,58,95,0.25)",
              }}
            >
              A
            </div>
            {!isMobile && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: NAVY, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                  Admin User
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>Administrator</div>
              </div>
            )}
          </div>
        </header>

        {/* ════ PAGE CONTENT ════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          {activeNav === "dashboard"    && <DashboardOverview isMobile={isMobile} />}
          {activeNav === "users"        && <UserManagement   isMobile={isMobile} />}
          {activeNav === "staff"        && <StaffManagement   isMobile={isMobile} />}
          {activeNav === "appointments" && <Appointments      isMobile={isMobile} />}
          {activeNav === "inventory"    && <AdminInventoryView />}
          {activeNav === "analytics"   && <Analytics         isMobile={isMobile} />}
          {activeNav === "reports"     && <Reports            isMobile={isMobile} />}
          {activeNav === "notifications" && <Notifications   isMobile={isMobile} />}
          {activeNav === "settings"    && <Settings           isMobile={isMobile} />}
        </div>
      </div>
    </div>
  );
}

/* ── Logout button (separated for hover state) ── */
function LogoutBtn({ isIconOnly, logout }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={isIconOnly ? "Logout" : undefined}
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
        borderLeft: hov ? `3px solid ${RED}` : "3px solid transparent",
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
        <IcoLogout />
      </span>
      {!isIconOnly && <span>Logout</span>}
    </button>
  );
}

/* ── Router ─────────────────────────────────────── */
export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/"              element={<AdminShell activeNav="dashboard"    />} />
      <Route path="/users"         element={<AdminShell activeNav="users"        />} />
      <Route path="/staff"         element={<AdminShell activeNav="staff"        />} />
      <Route path="/appointments"  element={<AdminShell activeNav="appointments" />} />
      <Route path="/inventory"     element={<AdminShell activeNav="inventory"    />} />
      <Route path="/analytics"     element={<AdminShell activeNav="analytics"    />} />
      <Route path="/reports"       element={<AdminShell activeNav="reports"      />} />
      <Route path="/notifications" element={<AdminShell activeNav="notifications"/>} />
      <Route path="/settings"      element={<AdminShell activeNav="settings"     />} />
      <Route path="*"              element={<Navigate to="" replace />} />
    </Routes>
  );
}
