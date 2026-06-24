import { useState } from "react";
import { IcoUp, IcoDown } from "../../../components/icon/AdminIcons";

/* ── Palette ── */
const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_LITE = "#264a77";
const RED       = "#DC2626";
const RED_SOFT  = "#fee2e2";
const GREEN     = "#16a34a";
const SLATE     = "#64748b";

/* ── Sample data ── */
const growthData = [
  { month: "Jan", users: 3200,  appts: 1100 },
  { month: "Feb", users: 3800,  appts: 980  },
  { month: "Mar", users: 4100,  appts: 1250 },
  { month: "Apr", users: 5200,  appts: 2100 },
  { month: "May", users: 6800,  appts: 3400 },
  { month: "Jun", users: 7500,  appts: 4200 },
  { month: "Jul", users: 8300,  appts: 4900 },
  { month: "Aug", users: 9100,  appts: 5600 },
  { month: "Sep", users: 10200, appts: 6100 },
  { month: "Oct", users: 11400, appts: 7000 },
  { month: "Nov", users: 12000, appts: 7800 },
  { month: "Dec", users: 12584, appts: 8500 },
];

const weeklyData = [
  { day: "Mon", confirmed: 45, pending: 12, cancelled: 3 },
  { day: "Tue", confirmed: 52, pending: 8,  cancelled: 2 },
  { day: "Wed", confirmed: 48, pending: 15, cancelled: 5 },
  { day: "Thu", confirmed: 61, pending: 10, cancelled: 1 },
  { day: "Fri", confirmed: 55, pending: 18, cancelled: 7 },
  { day: "Sat", confirmed: 38, pending: 5,  cancelled: 2 },
  { day: "Sun", confirmed: 22, pending: 3,  cancelled: 1 },
];

const recentActivity = [
  { id: 1, user: "Maria Santos",   action: "Booked Family Planning Consultation", time: "2 mins ago",  type: "appointment" },
  { id: 2, user: "Juan Dela Cruz", action: "Registered a new account",            time: "15 mins ago", type: "user"        },
  { id: 3, user: "Ana Reyes",      action: "Cancelled her appointment",           time: "32 mins ago", type: "cancel"      },
  { id: 4, user: "Pedro Lim",      action: "Requested medical records",           time: "1 hr ago",    type: "report"      },
  { id: 5, user: "Liza Garcia",    action: "Completed her consultation",          time: "2 hrs ago",   type: "done"        },
];

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
function LineChartSVG() {
  const [tooltip, setTooltip] = useState(null);
  const W = 500, H = 200;
  const PAD = { top: 12, right: 14, bottom: 30, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxUsers = 13000;

  const xOf = (i) => PAD.left + (i / (growthData.length - 1)) * innerW;
  const yOf = (v) => PAD.top + innerH - (v / maxUsers) * innerH;

  const usersPath = growthData.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d.users)}`).join(" ");
  const apptsPath = growthData.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d.appts)}`).join(" ");
  const yTicks = [0, 3000, 6000, 9000, 12000];

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yOf(v)} x2={W - PAD.right} y2={yOf(v)} stroke="rgba(30,58,95,0.07)" strokeDasharray="4 4"/>
            <text x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {v === 0 ? "0" : `${v / 1000}k`}
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
function BarChartSVG() {
  const [tooltip, setTooltip] = useState(null);
  const W = 500, H = 200;
  const PAD = { top: 10, right: 14, bottom: 30, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = 70;
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
function StatCard({ title, value, change, up, Icon, gradient }) {
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

      {/* ── Stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}>
        <StatCard
          title="Total Users"
          value="12,584"
          change="+12.5%"
          up
          Icon={StatIcoUsers}
          gradient={`linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_LITE})`}
        />
        <StatCard
          title="Active Appointments"
          value="348"
          change="+8.2%"
          up
          Icon={StatIcoCal}
          gradient={`linear-gradient(135deg, #16a34a, #22c55e)`}
        />
        <StatCard
          title="Pending Requests"
          value="56"
          change="-4.3%"
          up={false}
          Icon={StatIcoClock}
          gradient={`linear-gradient(135deg, #d97706, #f59e0b)`}
        />
        <StatCard
          title="System Health"
          value="94.5%"
          change="+2.1%"
          up
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
          <LineChartSVG />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>Weekly Appointment Status</h2>
            <span style={{ fontSize: "11px", fontWeight: 600, color: NAVY, background: `rgba(30,58,95,0.08)`, borderRadius: "20px", padding: "3px 10px" }}>This Week</span>
          </div>
          <BarChartSVG />
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
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#b0bac5" }}>{item.time}</p>
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
              { label: "New Registrations",  val: "23" },
              { label: "Appointments Today", val: "41" },
              { label: "Completed Sessions", val: "38" },
              { label: "Pending Reviews",    val: "7"  },
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

          {/* System Health */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: NAVY }}>System Health</h3>
            {[
              { label: "Server Uptime",  pct: 99.8, color: GREEN },
              { label: "DB Performance", pct: 87,   color: NAVY  },
              { label: "API Response",   pct: 94,   color: RED   },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#5a6475", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div style={{ height: "7px", borderRadius: "99px", background: "rgba(30,58,95,0.08)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "99px", transition: "width 0.4s ease" }} />
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
              <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: RED }}>Emergency Alert</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#7f1d1d", lineHeight: 1.5 }}>
                2 critical incident reports require immediate review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
