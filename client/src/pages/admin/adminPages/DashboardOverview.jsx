import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import {
  IcoClient,
  IcoStaff,
  IcoCal,
  IcoInventory,
} from "../../../components/icon/AdminIcons";

/* ── Palette ── */
const NAVY     = "#1E3A5F";
const NAVY_D   = "#13253E";
const NAVY_L   = "#2A5488";
const ORANGE   = "#FF8A00";
const ORANGE_B = "#FFF4E6";
const BLUE     = "#3B82F6";
const BLUE_B   = "#EFF6FF";
const PURPLE   = "#8B5CF6";
const PURPLE_B = "#F5F3FF";
const GREEN    = "#10B981";
const GREEN_B  = "#ECFDF5";
const RED      = "#EF4444";
const RED_B    = "#FEF2F2";
const SLATE    = "#64748B";
const LIGHT    = "#F8FAFC";
const WHITE    = "#FFFFFF";
const BORDER   = "rgba(30,58,95,0.08)";

const STATUS_CFG = {
  Pending:   { bg: ORANGE_B, color: "#d97706" },
  Confirmed: { bg: BLUE_B,  color: BLUE   },
  Completed: { bg: GREEN_B,  color: GREEN  },
  Cancelled: { bg: RED_B,    color: RED    },
};

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const ACTIVITY_COLOR = {
  appointment: ORANGE,
  user: BLUE,
  cancel: RED,
  report: PURPLE,
  done: GREEN,
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

/* ── Area Chart ── */
function AreaChart({ data }) {
  const [tip, setTip] = useState(null);
  const n = data.length;
  if (n === 0) {
    return (
      <div style={{ fontSize: 11, color: SLATE, textAlign: "center", padding: "30px 0" }}>
        No chart data yet
      </div>
    );
  }
  const values = data.flatMap((d) => [d.users, d.appts]);
  const maxV = Math.max(...values, 1);
  const W = 460, H = 120, PL = 30, PR = 12, PT = 10, PB = 22;
  const iW = W - PL - PR, iH = H - PT - PB;
  const xOf = (i) => PL + (i / (n - 1)) * iW;
  const yOf = (v) => PT + iH - (v / maxV) * iH;
  const line = (key) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(" ");
  const area = (key) => `${line(key)} L${xOf(n - 1).toFixed(1)},${PT + iH} L${xOf(0).toFixed(1)},${PT + iH} Z`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="aGradO" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.20" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aGradB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((v) => {
          const val = Math.round((v / 100) * maxV);
          return (
            <g key={v}>
              <line x1={PL} y1={yOf(val)} x2={W - PR} y2={yOf(val)} stroke={BORDER} strokeDasharray="3 3" />
              <text x={PL - 3} y={yOf(val) + 3} textAnchor="end" fontSize="7" fill="#94a3b8">{val}</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="7" fill="#94a3b8">{d.month}</text>
        ))}
        <path d={area("appts")} fill="url(#aGradO)" />
        <path d={area("users")} fill="url(#aGradB)" />
        <path d={line("appts")} fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={line("users")} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {tip !== null && (
          <line x1={xOf(tip)} y1={PT} x2={xOf(tip)} y2={PT + iH} stroke={SLATE} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        )}
        {data.map((d, i) => (
          <circle key={`a${i}`} cx={xOf(i)} cy={yOf(d.appts)} r={tip === i ? 5 : 3}
            fill={tip === i ? ORANGE : WHITE} stroke={ORANGE} strokeWidth="1.5"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTip(i)} onMouseLeave={() => setTip(null)}
          />
        ))}
        {data.map((d, i) => (
          <circle key={`u${i}`} cx={xOf(i)} cy={yOf(d.users)} r={tip === i ? 5 : 3}
            fill={tip === i ? BLUE : WHITE} stroke={BLUE} strokeWidth="1.5"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTip(i)} onMouseLeave={() => setTip(null)}
          />
        ))}
      </svg>
      {tip !== null && (
        <div style={{
          position: "absolute",
          left: `calc(${(xOf(tip) / W) * 100}% - 45px)`,
          top: Math.max(0, yOf(Math.max(data[tip].users, data[tip].appts)) - 48),
          background: WHITE, border: `1px solid ${BORDER}`,
          borderRadius: 6, padding: "4px 8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontSize: 10, pointerEvents: "none", zIndex: 30, whiteSpace: "nowrap"
        }}>
          <div style={{ color: NAVY, fontWeight: 700 }}>{data[tip].month}</div>
          <div style={{ color: ORANGE }}>Appointments: {data[tip].appts}</div>
          <div style={{ color: BLUE }}>Users: {data[tip].users}</div>
        </div>
      )}
    </div>
  );
}

/* ── Donut Chart ── */
function DonutChart({ segments, total }) {
  const [hov, setHov] = useState(null);
  const R = 30, C = 2 * Math.PI * R;
  const totalSafe = total || 1;
  const placed = segments.map((d, i) => ({
    ...d,
    start: segments.slice(0, i).reduce((s, x) => s + x.count, 0),
  }));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 80 80">
          {placed.map((d, i) => {
            const sv = (d.count / totalSafe) * C, off = C - (d.start / totalSafe) * C;
            return (
              <circle key={i} cx="40" cy="40" r={R}
                fill="none" stroke={d.color}
                strokeWidth={hov === i ? 10 : 7}
                strokeDasharray={`${sv} ${C - sv}`}
                strokeDashoffset={off}
                transform="rotate(-90 40 40)"
                style={{ transition: "all 0.15s", cursor: "pointer", opacity: hov === null || hov === i ? 1 : 0.5 }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 7, color: SLATE, textTransform: "uppercase" }}>
            {hov !== null ? placed[hov].name.split(" ")[0] : "Total"}
          </div>
          <div style={{ fontSize: 14, color: NAVY }}>
            {hov !== null ? `${placed[hov].pct}%` : total}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {placed.length === 0 ? (
          <div style={{ fontSize: 10, color: SLATE }}>No data yet</div>
        ) : (
          placed.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 10, color: SLATE }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>{d.name}</span>
              <span style={{ color: NAVY, flexShrink: 0 }}>{d.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── KPI Card ── */
function KpiCard({ label, value, change, icon, accent }) {
  const [hov, setHov] = useState(false);
  const hasChange = typeof change === "number";
  const up = change >= 0;
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: WHITE, borderRadius: 8, padding: "10px 14px",
        border: `1.5px solid ${hov ? accent : BORDER}`,
        boxShadow: hov ? "0 6px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.03)",
        transition: "all 0.2s", display: "flex", alignItems: "center",
        gap: 10, flex: 1, minWidth: 0, overflow: "hidden"
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 6, background: `${accent}15`,
        display: "flex", alignItems: "center", justifyContent: "center", color: accent, flexShrink: 0 }}>
        {icon()}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ fontSize: 10, color: SLATE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: 18, color: NAVY, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
        {hasChange ? (
          <div style={{ fontSize: 9, color: up ? GREEN : RED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {up ? "▲" : "▼"} {Math.abs(change)}% vs last month
          </div>
        ) : (
          <div style={{ fontSize: 9, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>vs last month</div>
        )}
      </div>
    </div>
  );
}

/* ── Shared select style ── */
const selStyle = {
  padding: "3px 8px", borderRadius: 6, border: `1.5px solid ${BORDER}`,
  background: WHITE, fontSize: 10, color: NAVY, outline: "none", cursor: "pointer"
};

/* ── Main Component ── */
export default function DashboardOverview({ isMobile }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [range, setRange] = useState("12M");
  const [showAll, setShowAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [dRes, aRes, apRes] = await Promise.all([
        fetch(`${__API_BASE__}/api/admin/dashboard`, { credentials: "include" }),
        fetch(`${__API_BASE__}/api/admin/analytics`, { credentials: "include" }),
        fetch(`${__API_BASE__}/api/admin/appointments`, { credentials: "include" }),
      ]);
      const d = await dRes.json();
      const a = await aRes.json();
      const ap = await apRes.json();
      if (d.success && a.success && ap.success) {
        setData(d.dashboard);
        setAnalytics(a.analytics);
        setAppointments(ap.appointments);
      } else {
        setErr(d.message || a.message || ap.message || "Failed to load dashboard");
      }
    } catch {
      setErr("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: LIGHT }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Loading dashboard...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: LIGHT }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: RED_B, display: "flex", alignItems: "center", justifyContent: "center", color: RED, margin: "0 auto 12px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Failed to load dashboard</p>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#94a3b8" }}>{err}</p>
          <button onClick={fetchData} style={{ border: "none", background: NAVY, color: "#fff", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Retry</button>
        </div>
      </div>
    );
  }

  const adminName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "Admin";
  const firstName = user?.firstName || adminName.split(" ")[0];

  const stats = data?.stats || null;
  const todaySummary = data?.todaySummary || null;
  const monthlyGrowth = data?.monthlyGrowth || [];
  const recentActivity = data?.recentActivity || [];
  const byDepartment = analytics?.byDepartment || [];

  const chartData = monthlyGrowth.slice(-12);
  const rangeMonths = { "3M": 3, "6M": 6, "12M": 12 }[range] || 12;
  const chartSlice = chartData.slice(-rangeMonths);

  const donutTotal = byDepartment.reduce((s, d) => s + d.count, 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const upcoming = appointments
    .filter((a) => a.date >= todayStr && (a.status === "Pending" || a.status === "Confirmed"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const filteredRows = statusFilter === "All" ? upcoming : upcoming.filter((a) => a.status === statusFilter);
  const visibleRows = (showAll ? filteredRows : filteredRows.slice(0, 3));

  const kpis = stats
    ? [
        { label: "Total Users",          value: String(stats.totalUsers.value),          change: stats.totalUsers.change,          Icon: IcoClient,    accent: ORANGE },
        { label: "Active Appointments",  value: String(stats.activeAppointments.value),  change: stats.activeAppointments.change,  Icon: IcoCal,       accent: BLUE   },
        { label: "Pending Requests",     value: String(stats.pendingRequests.value),     change: stats.pendingRequests.change,     Icon: IcoInventory, accent: PURPLE },
        { label: "Verified Users",       value: `${stats.verifiedUserRate.value}%`,      change: stats.verifiedUserRate.change,     Icon: IcoStaff,     accent: GREEN  },
      ]
    : [];

  const apptsToday = todaySummary?.appointmentsToday || 0;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "10px 16px",
      background: LIGHT, overflow: "hidden",
      height: "100%", boxSizing: "border-box", gap: 8,
      fontFamily: "'Inter','Poppins',sans-serif"
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 15, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Welcome Back, {firstName}!</div>
          <div style={{ fontSize: 11, color: SLATE, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {apptsToday > 0 ? (
              <>You have <span style={{ color: ORANGE }}>{apptsToday} appointment{apptsToday !== 1 ? "s" : ""}</span> today — keep it up!</>
            ) : (
              <>No appointments scheduled today — keep it up!</>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontSize: 11, color: SLATE, whiteSpace: "nowrap" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: 4 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <button onClick={fetchData} style={{
            display: "flex", alignItems: "center", gap: 5,
            background: WHITE, border: `1.5px solid ${BORDER}`,
            borderRadius: 8, padding: "5px 10px", fontSize: 11,
            color: NAVY, cursor: "pointer", whiteSpace: "nowrap"
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {kpis.map((k) => (
          <KpiCard key={k.label} label={k.label} value={k.value} change={k.change} icon={k.Icon} accent={k.accent} />
        ))}
      </div>

      {/* ── Main row ── */}
      <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── Left column (65%) ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 64%", minWidth: 0, overflow: "hidden" }}>

          {/* Area chart */}
          <div style={{
            background: WHITE, borderRadius: 8, padding: "10px 12px",
            border: `1.5px solid ${BORDER}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexShrink: 0 }}>
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontSize: 12, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Monthly Growth</div>
                <div style={{ fontSize: 10, color: SLATE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Registrations and appointments per month</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                <select value={range} onChange={(e) => setRange(e.target.value)} style={selStyle}>
                  {["3M", "6M", "12M"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <AreaChart data={chartSlice} />
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: WHITE, borderRadius: 8, padding: "8px 12px",
            border: `1.5px solid ${BORDER}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)", flexShrink: 0
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: NAVY }}>Upcoming Appointments</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selStyle}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => setShowAll(!showAll)} style={{
                  fontSize: 10, color: ORANGE, background: ORANGE_B,
                  border: `1px solid ${ORANGE}33`, borderRadius: 6,
                  padding: "3px 10px", cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  {showAll ? "Collapse" : "View All"}
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1.5px solid ${BORDER}`, background: "rgba(30,58,95,0.02)" }}>
                    {["Patient", "Date", "Time", "Service", "Status"].map((h) => (
                      <th key={h} style={{ padding: "5px 10px", fontSize: 9, color: SLATE, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "14px 10px", fontSize: 11, color: SLATE, textAlign: "center" }}>
                        No upcoming appointments{statusFilter !== "All" ? ` with status "${statusFilter}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((row, idx, arr) => (
                      <tr key={row._id}
                        style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${BORDER}` : "none", transition: "background 0.12s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,138,0,0.03)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "5px 10px", fontSize: 11, color: NAVY, whiteSpace: "nowrap" }}>{row.patient || "—"}</td>
                        <td style={{ padding: "5px 10px", fontSize: 11, color: SLATE, whiteSpace: "nowrap" }}>{row.date}</td>
                        <td style={{ padding: "5px 10px", fontSize: 11, color: SLATE, whiteSpace: "nowrap" }}>{row.time}</td>
                        <td style={{ padding: "5px 10px", fontSize: 11, color: SLATE, whiteSpace: "nowrap" }}>{row.department}</td>
                        <td style={{ padding: "5px 10px" }}>
                          <span style={{
                            fontSize: 9, padding: "2px 7px", borderRadius: 20,
                            background: STATUS_CFG[row.status]?.bg || "#f1f5f9",
                            color: STATUS_CFG[row.status]?.color || SLATE, whiteSpace: "nowrap"
                          }}>{row.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right panel (36%) ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 calc(36% - 4px)", minWidth: 0, overflow: "hidden" }}>

          {/* Donut */}
          <div style={{
            background: WHITE, borderRadius: 8, padding: "10px 12px",
            border: `1.5px solid ${BORDER}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            display: "flex", flexDirection: "column", flexShrink: 0
          }}>
            <div style={{ fontSize: 11, color: NAVY, marginBottom: 8 }}>Appointments by Service</div>
            <DonutChart segments={byDepartment} total={donutTotal} />
          </div>

          {/* Recent activity */}
          <div style={{
            background: WHITE, borderRadius: 8, padding: "10px 12px",
            border: `1.5px solid ${BORDER}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)", flex: 1, minHeight: 0, overflow: "hidden"
          }}>
            <div style={{ fontSize: 11, color: NAVY, marginBottom: 6 }}>Recent Activity</div>
            {recentActivity.length === 0 ? (
              <div style={{ fontSize: 10, color: SLATE, padding: "20px 0", textAlign: "center" }}>No recent activity</div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={a.id || i} style={{ display: "flex", gap: 7, alignItems: "flex-start",
                  padding: "5px 0", borderBottom: i < recentActivity.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACTIVITY_COLOR[a.type] || SLATE, marginTop: 3, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: NAVY, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.action}</div>
                    <div style={{ fontSize: 9, color: SLATE }}>{a.user}{a.time ? ` · ${timeAgo(a.time)}` : ""}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => navigate("/admin/analytics")} style={{
              flex: 1, padding: "7px", borderRadius: 8,
              border: `1.5px solid ${NAVY}`, background: "transparent",
              color: NAVY, fontSize: 11, cursor: "pointer"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,58,95,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >Analytics</button>
            <button onClick={() => navigate("/admin/appointments")} style={{
              flex: 1, padding: "7px", borderRadius: 8,
              border: "none", background: ORANGE,
              color: WHITE, fontSize: 11, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e07900"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; }}
            >
              View Appointments
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
