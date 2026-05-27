import { useState } from "react";

/* ─── FPOP Brand Tokens ─────────────────────────────────────── */
const NAVY      = "#1E3A5F";
const NAVY_DARK = "#152c4a";
const NAVY_MID  = "#1a3254";
const NAVY_LITE = "#264a77";
const GOLD      = "#F5C518";
const GREEN     = "#22c55e";
const RED       = "#ef4444";
const PURPLE    = "#7c3aed";
const ORANGE    = "#ea580c";

/* ─── Chart Data ────────────────────────────────────────────── */
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

/* ─── SVG Icons ─────────────────────────────────────────────── */
const IcoUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const IcoDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
  </svg>
);

const StatIcoUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const StatIcoCal   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const StatIcoClock = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const StatIcoTrend = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

/* ─── Pure SVG Line Chart ───────────────────────────────────── */
function LineChartSVG() {
  const [tooltip, setTooltip] = useState(null);
  const W = 500, H = 200, PAD = { top: 10, right: 14, bottom: 30, left: 44 };
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
            <text x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#9aa5b4">{v === 0 ? "0" : `${v / 1000}k`}</text>
          </g>
        ))}
        {growthData.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#9aa5b4">{d.month}</text>
        ))}
        <path d={usersPath} fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={apptsPath} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {growthData.map((d, i) => (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.users)} r="4" fill="#fff" stroke={NAVY} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ i, x: xOf(i), d })}
              onMouseLeave={() => setTooltip(null)}
            />
            <circle cx={xOf(i)} cy={yOf(d.appts)} r="4" fill="#fff" stroke={GREEN} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ i, x: xOf(i), d })}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "4px" }}>
        {[{ color: NAVY, label: "Users" }, { color: GREEN, label: "Appointments" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#5a6475" }}>
            <div style={{ width: "20px", height: "3px", background: color, borderRadius: "2px" }} />
            {label}
          </div>
        ))}
      </div>
      {tooltip && (
        <div style={{ position: "absolute", top: "20px", left: `calc(${(tooltip.x / 500) * 100}% - 60px)`, background: "#fff", border: "1px solid rgba(30,58,95,0.1)", borderRadius: "10px", padding: "8px 12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", fontSize: "12px", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 700, color: NAVY, marginBottom: "4px" }}>{tooltip.d.month}</div>
          <div style={{ color: NAVY }}>Users: <b>{tooltip.d.users.toLocaleString()}</b></div>
          <div style={{ color: GREEN }}>Appts: <b>{tooltip.d.appts.toLocaleString()}</b></div>
        </div>
      )}
    </div>
  );
}

/* ─── Pure SVG Bar Chart ────────────────────────────────────── */
function BarChartSVG() {
  const [tooltip, setTooltip] = useState(null);
  const W = 500, H = 200, PAD = { top: 10, right: 14, bottom: 30, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = 70;
  const groupW = innerW / weeklyData.length;
  const barW = (groupW * 0.7) / 3;
  const yTicks = [0, 20, 40, 60];

  const yOf = (v) => PAD.top + innerH - (v / maxVal) * innerH;
  const barH = (v) => (v / maxVal) * innerH;

  const colors = [NAVY, GOLD, RED];
  const keys = ["confirmed", "pending", "cancelled"];

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yOf(v)} x2={W - PAD.right} y2={yOf(v)} stroke="rgba(30,58,95,0.07)" strokeDasharray="4 4"/>
            <text x={PAD.left - 4} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#9aa5b4">{v}</text>
          </g>
        ))}
        {weeklyData.map((d, gi) => {
          const gx = PAD.left + gi * groupW + groupW * 0.15;
          return (
            <g key={gi}>
              <text x={gx + barW * 1.5} y={H - 6} textAnchor="middle" fontSize="10" fill="#9aa5b4">{d.day}</text>
              {keys.map((k, bi) => (
                <rect key={k}
                  x={gx + bi * (barW + 1)}
                  y={yOf(d[k])}
                  width={barW}
                  height={barH(d[k])}
                  fill={colors[bi]}
                  rx="3"
                  style={{ cursor: "pointer", opacity: tooltip?.gi === gi ? 1 : 0.85, transition: "opacity 0.15s" }}
                  onMouseEnter={() => setTooltip({ gi, d })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "4px" }}>
        {[{ color: NAVY, label: "Confirmed" }, { color: GOLD, label: "Pending" }, { color: RED, label: "Cancelled" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#5a6475" }}>
            <div style={{ width: "12px", height: "12px", background: color, borderRadius: "3px" }} />
            {label}
          </div>
        ))}
      </div>
      {tooltip && (
        <div style={{ position: "absolute", top: "10px", left: `calc(${(tooltip.gi / weeklyData.length) * 100}% + 10px)`, background: "#fff", border: "1px solid rgba(30,58,95,0.1)", borderRadius: "10px", padding: "8px 12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", fontSize: "12px", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 700, color: NAVY, marginBottom: "4px" }}>{tooltip.d.day}</div>
          <div style={{ color: NAVY }}>Confirmed: <b>{tooltip.d.confirmed}</b></div>
          <div style={{ color: "#b45309" }}>Pending: <b>{tooltip.d.pending}</b></div>
          <div style={{ color: RED }}>Cancelled: <b>{tooltip.d.cancelled}</b></div>
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ title, value, change, up, Icon, iconBg }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: "16px", padding: "22px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        boxShadow: hov ? "0 10px 32px rgba(30,58,95,0.14)" : "0 2px 14px rgba(30,58,95,0.07)",
        border: "1px solid rgba(30,58,95,0.07)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease", cursor: "default",
      }}>
      <div>
        <p style={{ margin: 0, fontSize: "11px", color: "#8a96a3", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>{title}</p>
        <p style={{ margin: "6px 0 10px", fontSize: "30px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color: up ? GREEN : RED, display: "flex", alignItems: "center", gap: "2px", fontSize: "12px", fontWeight: 700 }}>
            {up ? <IcoUp /> : <IcoDown />} {change}
          </span>
          <span style={{ fontSize: "11px", color: "#b0bac5" }}>vs last month</span>
        </div>
      </div>
      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon />
      </div>
    </div>
  );
}

const DOT_COLORS = { appointment: "#1d4ed8", user: GREEN, cancel: RED, report: "#ca8a04", done: PURPLE };
const ActivityDot = ({ type }) => (
  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: DOT_COLORS[type] || DOT_COLORS.appointment, display: "inline-block", flexShrink: 0, marginTop: "5px" }} />
);

/* ─── Main Export ───────────────────────────────────────────── */
export default function DashboardOverview({ isMobile }) {
  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

      {/* Heading */}
      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>Dashboard Overview</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Welcome back, Admin. Here&rsquo;s what&rsquo;s happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard title="Total Users"         value="12,584" change="+12.5%" up Icon={StatIcoUsers} iconBg={`${NAVY}1a`} />
        <StatCard title="Active Appointments" value="348"    change="+8.2%"  up Icon={StatIcoCal}   iconBg="#dcfce7"    />
        <StatCard title="Pending Requests"    value="56"     change="-4.3%"  up={false} Icon={StatIcoClock} iconBg="#ffedd5" />
        <StatCard title="Analytics Summary"   value="94.5%"  change="+2.1%"  up Icon={StatIcoTrend} iconBg="#f3e8ff"    />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: NAVY }}>User Growth &amp; Appointments</h2>
          <LineChartSVG />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Weekly Appointment Status</h2>
          <BarChartSVG />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">

        {/* Recent Activity */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY }}>Recent Activity</h2>
            <button style={{ fontSize: "12px", color: NAVY, fontWeight: 600, background: `${NAVY}0e`, border: "none", borderRadius: "20px", padding: "5px 14px", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>View All</button>
          </div>
          {recentActivity.map((item, idx) => (
            <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: idx < recentActivity.length - 1 ? "1px solid rgba(30,58,95,0.06)" : "none" }}>
              <ActivityDot type={item.type} />
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#2d3748" }}>
                  <span style={{ color: NAVY }}>{item.user}</span> — {item.action}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#b0bac5" }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Today's Summary */}
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_LITE} 100%)`, borderRadius: "16px", padding: "22px 24px", boxShadow: "0 6px 24px rgba(30,58,95,0.3)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 700, color: GOLD }}>Today&rsquo;s Summary</h3>
            {[
              { label: "New Registrations",  val: "23" },
              { label: "Appointments Today", val: "41" },
              { label: "Completed Sessions", val: "38" },
              { label: "Pending Reviews",    val: "7"  },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
                <span style={{ fontSize: "16px", fontWeight: 800, color: GOLD }}>{val}</span>
              </div>
            ))}
          </div>

          {/* System Health */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: NAVY }}>System Health</h3>
            {[
              { label: "Server Uptime",  pct: 99.8, color: GREEN  },
              { label: "DB Performance", pct: 87,   color: NAVY   },
              { label: "API Response",   pct: 94,   color: GOLD   },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12px", color: "#5a6475", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: "99px", background: "rgba(30,58,95,0.08)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "99px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
