import { useEffect, useState } from "react";
import { IcoUp, IcoDown } from "../../../components/icon/AdminIcons";

/* ── Palette ── */
const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_LITE = "#264a77";
const RED       = "#DC2626";
const RED_SOFT  = "#fee2e2";
const GREEN     = "#16a34a";
const SLATE     = "#64748b";

/* ── Dashboard defaults ── */
const emptyGrowthData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  .map((month) => ({ month, users: 0, appts: 0 }));

const emptyWeeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  .map((day) => ({ day, confirmed: 0, pending: 0, cancelled: 0 }));

const emptyDashboard = {
  stats: {
    totalUsers: { value: 0, change: 0 },
    activeAppointments: { value: 0, change: 0 },
    pendingRequests: { value: 0, change: 0 },
    verifiedUserRate: { value: 0, change: 0 },
  },
  monthlyGrowth: emptyGrowthData,
  weeklyAppointments: emptyWeeklyData,
  recentActivity: [],
  todaySummary: {
    newRegistrations: 0,
    appointmentsToday: 0,
    completedSessions: 0,
    pendingReviews: 0,
  },
  accountSummary: {
    verifiedUsers: 0,
    suspendedUsers: 0,
    staffCount: 0,
    unreadHighPriorityAlerts: 0,
  },
};

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatPercent = (value) => `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
const formatChange = (value) => `${Number(value || 0) >= 0 ? "+" : ""}${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
const formatTimeAgo = (value) => {
  if (!value) return "";
  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs)) return "";
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

/* ── Stat card icons ── */
const StatIcoUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const StatIcoCal = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const StatIcoClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const StatIcoTrend = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

/* ── Line chart ── */
function LineChartSVG({ data = emptyGrowthData }) {
  const [tooltip, setTooltip] = useState(null);
  const growthData = data.length ? data : emptyGrowthData;
  const W = 500, H = 200;
  const PAD = { top: 12, right: 14, bottom: 30, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxUsers = Math.max(1, ...growthData.map((d) => Math.max(d.users || 0, d.appts || 0)));

  const xOf = (i) => PAD.left + (i / Math.max(growthData.length - 1, 1)) * innerW;
  const yOf = (v) => PAD.top + innerH - (v / maxUsers) * innerH;

  const usersPath = growthData.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d.users)}`).join(" ");
  const apptsPath = growthData.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d.appts)}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => Math.round(maxUsers * pct));

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yOf(v)} x2={W - PAD.right} y2={yOf(v)} stroke="rgba(30,58,95,0.07)" strokeDasharray="4 4"/>
            <text x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {v >= 1000 ? `${Math.round(v / 100) / 10}k` : v}
            </text>
          </g>
        ))}
        {growthData.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.month}</text>
        ))}
        {/* Area fills */}
        <defs>
          <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NAVY} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={NAVY} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={RED} stopOpacity="0.12"/>
            <stop offset="100%" stopColor={RED} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path
          d={`${usersPath} L${xOf(growthData.length - 1)},${PAD.top + innerH} L${xOf(0)},${PAD.top + innerH} Z`}
          fill="url(#navyGrad)"
        />
        <path
          d={`${apptsPath} L${xOf(growthData.length - 1)},${PAD.top + innerH} L${xOf(0)},${PAD.top + innerH} Z`}
          fill="url(#redGrad)"
        />
        <path d={usersPath} fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={apptsPath} fill="none" stroke={RED}  strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {growthData.map((d, i) => (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.users)} r="4" fill="#fff" stroke={NAVY} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ i, x: xOf(i), d })}
              onMouseLeave={() => setTooltip(null)}
            />
            <circle cx={xOf(i)} cy={yOf(d.appts)} r="4" fill="#fff" stroke={RED} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ i, x: xOf(i), d })}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "6px" }}>
        {[{ color: NAVY, label: "Users" }, { color: RED, label: "Appointments" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: SLATE }}>
            <div style={{ width: "20px", height: "3px", background: color, borderRadius: "2px" }} />
            {label}
          </div>
        ))}
      </div>
      {tooltip && (
        <div style={{
          position: "absolute", top: "16px",
          left: `calc(${(tooltip.x / 500) * 100}% - 60px)`,
          background: "#fff", border: "1px solid rgba(30,58,95,0.10)",
          borderRadius: "10px", padding: "8px 12px",
          boxShadow: "0 8px 24px rgba(30,58,95,0.12)",
          fontSize: "12px", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 700, color: NAVY, marginBottom: "4px" }}>{tooltip.d.month}</div>
          <div style={{ color: NAVY }}>Users: <b>{tooltip.d.users.toLocaleString()}</b></div>
          <div style={{ color: RED }}>Appts: <b>{tooltip.d.appts.toLocaleString()}</b></div>
        </div>
      )}
    </div>
  );
}

/* ── Bar chart ── */
function BarChartSVG({ data = emptyWeeklyData }) {
  const [tooltip, setTooltip] = useState(null);
  const weeklyData = data.length ? data : emptyWeeklyData;
  const W = 500, H = 200;
  const PAD = { top: 10, right: 14, bottom: 30, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(1, ...weeklyData.flatMap((d) => [d.confirmed || 0, d.pending || 0, d.cancelled || 0]));
  const groupW = innerW / weeklyData.length;
  const barW = (groupW * 0.7) / 3;
  const yTicks = [0, 20, 40, 60];
  const yOf = (v) => PAD.top + innerH - (v / maxVal) * innerH;
  const barH = (v) => (v / maxVal) * innerH;
  const colors = [NAVY, "#f59e0b", RED];
  const keys = ["confirmed", "pending", "cancelled"];

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yOf(v)} x2={W - PAD.right} y2={yOf(v)} stroke="rgba(30,58,95,0.07)" strokeDasharray="4 4"/>
            <text x={PAD.left - 4} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
          </g>
        ))}
        {weeklyData.map((d, gi) => {
          const gx = PAD.left + gi * groupW + groupW * 0.15;
          return (
            <g key={gi}>
              <text x={gx + barW * 1.5} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.day}</text>
              {keys.map((k, bi) => (
                <rect key={k}
                  x={gx + bi * (barW + 1)}
                  y={yOf(d[k])}
                  width={barW}
                  height={barH(d[k])}
                  fill={colors[bi]}
                  rx="3"
                  style={{ cursor: "pointer", opacity: tooltip?.gi === gi ? 1 : 0.82, transition: "opacity 0.15s" }}
                  onMouseEnter={() => setTooltip({ gi, d })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "6px" }}>
        {[{ color: NAVY, label: "Confirmed" }, { color: "#f59e0b", label: "Pending" }, { color: RED, label: "Cancelled" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: SLATE }}>
            <div style={{ width: "12px", height: "12px", background: color, borderRadius: "3px" }} />
            {label}
          </div>
        ))}
      </div>
      {tooltip && (
        <div style={{
          position: "absolute", top: "10px",
          left: `calc(${(tooltip.gi / weeklyData.length) * 100}% + 10px)`,
          background: "#fff", border: "1px solid rgba(30,58,95,0.10)",
          borderRadius: "10px", padding: "8px 12px",
          boxShadow: "0 8px 24px rgba(30,58,95,0.12)",
          fontSize: "12px", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 700, color: NAVY, marginBottom: "4px" }}>{tooltip.d.day}</div>
          <div style={{ color: NAVY }}>Confirmed: <b>{tooltip.d.confirmed}</b></div>
          <div style={{ color: "#b45309" }}>Pending: <b>{tooltip.d.pending}</b></div>
          <div style={{ color: RED }}>Cancelled: <b>{tooltip.d.cancelled}</b></div>
        </div>
      )}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ title, value, change, up,gradient }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "22px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        boxShadow: hov ? "0 12px 36px rgba(30,58,95,0.14)" : "0 2px 12px rgba(30,58,95,0.07)",
        border: "1px solid rgba(30,58,95,0.07)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        cursor: "default",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: gradient, borderRadius: "16px 16px 0 0",
      }} />
      <div>
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          {title}
        </p>
        <p style={{ margin: "8px 0 10px", fontSize: "32px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px", lineHeight: 1 }}>
          {value}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color: up ? GREEN : RED, display: "flex", alignItems: "center", gap: "2px", fontSize: "12px", fontWeight: 700 }}>
            {up ? <IcoUp /> : <IcoDown />} {change}
          </span>
          <span style={{ fontSize: "11px", color: "#b0bac5" }}>vs last month</span>
        </div>
      </div>
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        background: gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <Icon />
      </div>
    </div>
  );
}

const DOT_COLORS = {
  appointment: NAVY,
  user: GREEN,
  cancel: RED,
  report: "#d97706",
  done: "#6d28d9",
};

const ActivityDot = ({ type }) => (
  <span style={{
    width: "8px", height: "8px", borderRadius: "50%",
    background: DOT_COLORS[type] || DOT_COLORS.appointment,
    display: "inline-block", flexShrink: 0, marginTop: "5px",
  }} />
);

/* ── Main export ── */
export default function DashboardOverview({ isMobile }) {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          credentials: "include",
        });
        const data = await res.json();

        if (!mounted) return;
        if (data.success) {
          setDashboard({ ...emptyDashboard, ...data.dashboard });
        } else {
          setError(data.message || "Failed to load dashboard data.");
        }
      } catch {
        if (mounted) setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = dashboard.stats || emptyDashboard.stats;
  const todaySummary = dashboard.todaySummary || emptyDashboard.todaySummary;
  const accountSummary = dashboard.accountSummary || emptyDashboard.accountSummary;
  const recentActivity = dashboard.recentActivity || [];

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f5f9" }}>

      {/* Page header */}
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>
            Welcome back, Admin. Here&rsquo;s what&rsquo;s happening today.
          </p>
        </div>
        {/* Live date badge */}
        <div style={{
          background: "#fff", border: "1px solid rgba(30,58,95,0.10)",
          borderRadius: "10px", padding: "8px 16px",
          fontSize: "12px", fontWeight: 600, color: NAVY,
          boxShadow: "0 2px 8px rgba(30,58,95,0.06)",
          whiteSpace: "nowrap",
        }}>
          📅 {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: "18px",
          background: RED_SOFT,
          border: `1px solid rgba(220,38,38,0.22)`,
          borderRadius: "12px",
          padding: "12px 16px",
          color: RED,
          fontSize: "13px",
          fontWeight: 600,
        }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{
          marginBottom: "18px",
          background: "#fff",
          border: "1px solid rgba(30,58,95,0.08)",
          borderRadius: "12px",
          padding: "12px 16px",
          color: SLATE,
          fontSize: "13px",
          fontWeight: 600,
        }}>
          Loading real dashboard data...
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}>
        <StatCard
          title="Total Users"
          value={formatNumber(stats.totalUsers?.value)}
          change={formatChange(stats.totalUsers?.change)}
          up={(stats.totalUsers?.change || 0) >= 0}
          Icon={StatIcoUsers}
          gradient={`linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_LITE})`}
        />
        <StatCard
          title="Active Appointments"
          value={formatNumber(stats.activeAppointments?.value)}
          change={formatChange(stats.activeAppointments?.change)}
          up={(stats.activeAppointments?.change || 0) >= 0}
          Icon={StatIcoCal}
          gradient={`linear-gradient(135deg, #16a34a, #22c55e)`}
        />
        <StatCard
          title="Pending Requests"
          value={formatNumber(stats.pendingRequests?.value)}
          change={formatChange(stats.pendingRequests?.change)}
          up={(stats.pendingRequests?.change || 0) >= 0}
          Icon={StatIcoClock}
          gradient={`linear-gradient(135deg, #d97706, #f59e0b)`}
        />
        <StatCard
          title="Verified Users"
          value={formatPercent(stats.verifiedUserRate?.value)}
          change={formatChange(stats.verifiedUserRate?.change)}
          up={(stats.verifiedUserRate?.change || 0) >= 0}
          Icon={StatIcoTrend}
          gradient={`linear-gradient(135deg, ${RED}, #f87171)`}
        />
      </div>

      {/* ── Charts row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>User Growth &amp; Appointments</h2>
            <span style={{ fontSize: "11px", fontWeight: 600, color: GREEN, background: "#dcfce7", borderRadius: "20px", padding: "3px 10px" }}>▲ Yearly</span>
          </div>
          <LineChartSVG data={dashboard.monthlyGrowth} />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>Weekly Appointment Status</h2>
            <span style={{ fontSize: "11px", fontWeight: 600, color: NAVY, background: `rgba(30,58,95,0.08)`, borderRadius: "20px", padding: "3px 10px" }}>This Week</span>
          </div>
          <BarChartSVG data={dashboard.weeklyAppointments} />
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
        gap: "16px",
      }}>
        {/* Recent activity */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>Recent Activity</h2>
            <button style={{
              fontSize: "12px", color: NAVY, fontWeight: 600,
              background: `rgba(30,58,95,0.07)`, border: "none",
              borderRadius: "20px", padding: "5px 14px",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s",
            }}>View All</button>
          </div>
          {recentActivity.length === 0 && (
            <div style={{ padding: "18px 0", color: "#94a3b8", fontSize: "13px" }}>
              No recent activity yet.
            </div>
          )}
          {recentActivity.map((item, idx) => (
            <div key={item.id} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: idx < recentActivity.length - 1 ? "1px solid rgba(30,58,95,0.06)" : "none",
            }}>
              <ActivityDot type={item.type} />
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                  <span style={{ color: NAVY }}>{item.user}</span> — {item.action}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#b0bac5" }}>{formatTimeAgo(item.time)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Today's Summary — dark navy card */}
          <div style={{
            background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_LITE} 100%)`,
            borderRadius: "16px", padding: "22px 24px",
            boxShadow: "0 8px 28px rgba(21,44,74,0.28)",
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Today&rsquo;s Summary
            </h3>
            {[
              { label: "New Registrations", val: formatNumber(todaySummary.newRegistrations) },
              { label: "Appointments Today", val: formatNumber(todaySummary.appointmentsToday) },
              { label: "Completed Sessions", val: formatNumber(todaySummary.completedSessions) },
              { label: "Pending Reviews", val: formatNumber(todaySummary.pendingReviews) },
            ].map(({ label, val }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>{label}</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Account Summary */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: NAVY }}>Account Summary</h3>
            {[
              { label: "Verified Users", val: accountSummary.verifiedUsers, color: GREEN },
              { label: "Staff Accounts", val: accountSummary.staffCount, color: NAVY },
              { label: "Suspended Users", val: accountSummary.suspendedUsers, color: RED },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#5a6475", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color }}>{formatNumber(val)}</span>
                </div>
                <div style={{ height: "7px", borderRadius: "99px", background: "rgba(30,58,95,0.08)" }}>
                  <div style={{
                    width: `${Math.min(100, Number(val || 0) * 8)}%`,
                    minWidth: Number(val || 0) > 0 ? "8px" : 0,
                    height: "100%",
                    background: color,
                    borderRadius: "99px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Emergency alert card */}
          <div style={{
            background: RED_SOFT,
            border: `1.5px solid rgba(220,38,38,0.2)`,
            borderRadius: "16px", padding: "18px 20px",
            display: "flex", gap: "14px", alignItems: "flex-start",
          }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: RED, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: RED }}>Priority Alerts</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#7f1d1d", lineHeight: 1.5 }}>
                {formatNumber(accountSummary.unreadHighPriorityAlerts)} unread high-priority alert{Number(accountSummary.unreadHighPriorityAlerts || 0) !== 1 ? "s" : ""} require review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
