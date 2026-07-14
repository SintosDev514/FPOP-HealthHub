/* global __API_BASE__ */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IcoClient,
  IcoStaff,
  IcoInventory,
} from "../../../components/icon/AdminIcons";

const NAVY = "#1E3A5F";
const ORANGE = "#FF8A00";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const GREEN = "#10B981";
const RED = "#EF4444";
const SLATE = "#64748B";
const LIGHT = "#F8FAFC";
const WHITE = "#FFFFFF";
const BORDER = "rgba(30,58,95,0.08)";

const IcoCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const formatNumber = (value) => Number(value || 0).toLocaleString("en-PH");
const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;
const formatChange = (value) => {
  const n = Number(value || 0);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
};

const timeAgo = (date) => {
  if (!date) return "recently";
  const created = new Date(date).getTime();
  if (Number.isNaN(created)) return "recently";
  const mins = Math.floor((Date.now() - created) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const activityColor = (type) => {
  if (type === "appointment") return ORANGE;
  if (type === "user") return BLUE;
  if (type === "cancel") return RED;
  if (type === "report") return PURPLE;
  return GREEN;
};

function AreaChart({ data }) {
  const [tip, setTip] = useState(null);
  const vals = data.map((item) => Number(item.value || 0));
  const labels = data.map((item) => item.label);
  const maxVal = Math.max(...vals, 1);
  const W = 440, H = 110, PL = 28, PR = 8, PT = 8, PB = 20;
  const iW = W - PL - PR, iH = H - PT - PB;
  const xOf = (i) => PL + (i / Math.max(vals.length - 1, 1)) * iW;
  const yOf = (v) => PT + iH - (v / maxVal) * iH;
  const stroke = vals.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(v)}`).join(" ");
  const area = `${stroke} L${xOf(vals.length - 1)},${PT + iH} L${xOf(0)},${PT + iH} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => Math.round(maxVal * pct));

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="adminDashAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.20" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke={BORDER} strokeDasharray="3 3" />
            <text x={PL - 3} y={yOf(v) + 3} textAnchor="end" fontSize="7" fill="#94a3b8">{v}</text>
          </g>
        ))}
        {labels.map((label, i) => (
          <text key={label} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="7" fill="#94a3b8">{label}</text>
        ))}
        <path d={area} fill="url(#adminDashAreaGrad)" />
        <path d={stroke} fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {tip !== null && <line x1={xOf(tip)} y1={PT} x2={xOf(tip)} y2={PT + iH} stroke={ORANGE} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />}
        {vals.map((v, i) => (
          <circle
            key={`${labels[i]}-${i}`}
            cx={xOf(i)}
            cy={yOf(v)}
            r={tip === i ? 5 : 3}
            fill={tip === i ? ORANGE : WHITE}
            stroke={ORANGE}
            strokeWidth="1.5"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTip(i)}
            onMouseLeave={() => setTip(null)}
          />
        ))}
      </svg>
      {tip !== null && (
        <div style={{
          position: "absolute",
          left: `calc(${(xOf(tip) / W) * 100}% - 40px)`,
          top: Math.max(0, yOf(vals[tip]) - 42),
          background: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          padding: "4px 8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontSize: 10,
          pointerEvents: "none",
          zIndex: 30,
          whiteSpace: "nowrap",
        }}>
          <div style={{ color: NAVY }}>{labels[tip]}</div>
          <div style={{ color: ORANGE }}>{formatNumber(vals[tip])}</div>
        </div>
      )}
    </div>
  );
}

function DonutChart({ segments, total }) {
  const [hov, setHov] = useState(null);
  const R = 30, C = 2 * Math.PI * R;
  const safeTotal = Math.max(total, 1);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(30,58,95,0.08)" strokeWidth="7" />
          {segments.map((d, i) => {
            const pct = total ? (d.value / safeTotal) * 100 : 0;
            const startPct = segments
              .slice(0, i)
              .reduce((sum, segment) => sum + (total ? (segment.value / safeTotal) * 100 : 0), 0);
            const sv = (pct / 100) * C, off = C - (startPct / 100) * C;
            return (
              <circle
                key={d.name}
                cx="40"
                cy="40"
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth={hov === i ? 10 : 7}
                strokeDasharray={`${sv} ${C - sv}`}
                strokeDashoffset={off}
                transform="rotate(-90 40 40)"
                style={{ transition: "all 0.15s", cursor: "pointer", opacity: hov === null || hov === i ? 1 : 0.5 }}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 7, color: SLATE, textTransform: "uppercase" }}>{hov !== null ? segments[hov].name.split(" ")[0] : "Total"}</div>
          <div style={{ fontSize: 14, color: NAVY }}>{hov !== null ? formatNumber(segments[hov].value) : formatNumber(total)}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {segments.map((d, i) => {
          const pct = total ? ((d.value / safeTotal) * 100).toFixed(1) : "0.0";
          return (
            <div
              key={d.name}
              style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 10, color: SLATE }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>{d.name}</span>
              <span style={{ color: NAVY, flexShrink: 0 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiCard({ label, value, delta, accent, Icon, suffix = "" }) {
  const [hov, setHov] = useState(false);
  const change = Number(delta || 0);
  const up = change >= 0;
  const iconNode = Icon ? Icon() : null;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: WHITE,
        borderRadius: 8,
        padding: "10px 14px",
        border: `1.5px solid ${hov ? accent : BORDER}`,
        boxShadow: hov ? "0 6px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.03)",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 6, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", color: accent, flexShrink: 0 }}>
        {iconNode}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ fontSize: 10, color: SLATE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: 18, color: NAVY, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}{suffix}</div>
        <div style={{ fontSize: 9, color: up ? GREEN : RED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {up ? "Up" : "Down"} {formatChange(change)} vs last month
        </div>
      </div>
    </div>
  );
}

const selStyle = {
  padding: "3px 8px",
  borderRadius: 6,
  border: `1.5px solid ${BORDER}`,
  background: WHITE,
  fontSize: 10,
  color: NAVY,
  outline: "none",
  cursor: "pointer",
};

const panelStyle = {
  background: WHITE,
  borderRadius: 8,
  border: `1.5px solid ${BORDER}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
};

function CenterState({ title, message, actionLabel, onAction }) {
  return (
    <div style={{ ...panelStyle, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: SLATE, marginBottom: onAction ? 14 : 0 }}>{message}</div>
        {onAction && (
          <button onClick={onAction} style={{ border: "none", background: NAVY, color: WHITE, borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardOverview({ isMobile }) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartMode, setChartMode] = useState("weekly");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/dashboard`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load dashboard data");
      setDashboard(data.dashboard);
    } catch (err) {
      setDashboard(null);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboard?.stats || {};
  const todaySummary = dashboard?.todaySummary || {};
  const accountSummary = dashboard?.accountSummary || {};
  const weeklyAppointments = dashboard?.weeklyAppointments || [];
  const monthlyGrowth = dashboard?.monthlyGrowth || [];
  const recentActivity = dashboard?.recentActivity || [];

  const chartData = chartMode === "weekly"
    ? weeklyAppointments.map((item) => ({
        label: item.day,
        value: Number(item.confirmed || 0) + Number(item.pending || 0) + Number(item.cancelled || 0),
      }))
    : monthlyGrowth.map((item) => ({
        label: item.month,
        value: Number(item.appts || 0),
      }));

  const accountSegments = [
    { name: "Verified", value: Number(accountSummary.verifiedUsers || 0), color: GREEN },
    { name: "Staff", value: Number(accountSummary.staffCount || 0), color: BLUE },
    { name: "Suspended", value: Number(accountSummary.suspendedUsers || 0), color: RED },
    { name: "High Alerts", value: Number(accountSummary.unreadHighPriorityAlerts || 0), color: PURPLE },
  ];
  const accountTotal = accountSegments.reduce((sum, item) => sum + item.value, 0);

  const summaryRows = [
    { label: "New Registrations", value: todaySummary.newRegistrations || 0, color: BLUE },
    { label: "Appointments Today", value: todaySummary.appointmentsToday || 0, color: ORANGE },
    { label: "Completed Sessions", value: todaySummary.completedSessions || 0, color: GREEN },
    { label: "Pending Reviews", value: todaySummary.pendingReviews || 0, color: RED },
  ];

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: isMobile ? "10px 12px" : "10px 16px",
      background: LIGHT,
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
      gap: 8,
      fontFamily: "'Inter','Poppins',sans-serif",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 15, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Welcome Back, Admin!</div>
          <div style={{ fontSize: 11, color: SLATE, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            You have <span style={{ color: ORANGE }}>{formatNumber(todaySummary.appointmentsToday)}</span> appointment{Number(todaySummary.appointmentsToday || 0) === 1 ? "" : "s"} today.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontSize: 11, color: SLATE, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
            <IcoCalendar /> {new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <button onClick={fetchDashboard} style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: WHITE,
            border: `1.5px solid ${BORDER}`,
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11,
            color: NAVY,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <CenterState title="Loading dashboard..." message="Getting the latest admin data from the database." />
      ) : error ? (
        <CenterState title="Failed to load dashboard" message={error} actionLabel="Retry" onAction={fetchDashboard} />
      ) : !dashboard ? (
        <CenterState title="No dashboard data" message="The server returned no dashboard details." actionLabel="Retry" onAction={fetchDashboard} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <KpiCard label="Total Users" value={formatNumber(stats.totalUsers?.value)} delta={stats.totalUsers?.change} Icon={IcoClient} accent={ORANGE} />
            <KpiCard label="Active Appointments" value={formatNumber(stats.activeAppointments?.value)} delta={stats.activeAppointments?.change} Icon={IcoStaff} accent={BLUE} />
            <KpiCard label="Verified User Rate" value={formatPercent(stats.verifiedUserRate?.value)} delta={stats.verifiedUserRate?.change} Icon={IcoInventory} accent={PURPLE} />
          </div>

          <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0, overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: isMobile ? "1 1 auto" : "0 0 64%", minWidth: 0, overflow: "hidden" }}>
              <div style={{
                ...panelStyle,
                padding: "10px 12px",
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexShrink: 0 }}>
                  <div style={{ minWidth: 0, overflow: "hidden" }}>
                    <div style={{ fontSize: 12, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Progress Overview</div>
                    <div style={{ fontSize: 10, color: SLATE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {chartMode === "weekly" ? "This week's appointment volume" : "Monthly appointment trend"}
                    </div>
                  </div>
                  <select value={chartMode} onChange={(e) => setChartMode(e.target.value)} style={selStyle}>
                    <option value="weekly">Weekly Appointments</option>
                    <option value="monthly">Monthly Growth</option>
                  </select>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", alignItems: "center" }}>
                  {chartData.length > 0 ? (
                    <AreaChart data={chartData} />
                  ) : (
                    <div style={{ width: "100%", textAlign: "center", color: SLATE, fontSize: 12 }}>No chart data yet.</div>
                  )}
                </div>
              </div>

              <div style={{ ...panelStyle, padding: "8px 12px", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: NAVY }}>Today Summary</div>
                  <div style={{ fontSize: 10, color: SLATE }}>Live from database</div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: `1.5px solid ${BORDER}`, background: "rgba(30,58,95,0.02)" }}>
                        {["Metric", "Value", "Source"].map((h) => (
                          <th key={h} style={{ padding: "5px 10px", fontSize: 9, color: SLATE, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map((row, idx) => (
                        <tr key={row.label} style={{ borderBottom: idx < summaryRows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                          <td style={{ padding: "6px 10px", fontSize: 11, color: NAVY, whiteSpace: "nowrap" }}>{row.label}</td>
                          <td style={{ padding: "6px 10px", fontSize: 11, color: row.color, whiteSpace: "nowrap", fontWeight: 700 }}>{formatNumber(row.value)}</td>
                          <td style={{ padding: "6px 10px", fontSize: 11, color: SLATE, whiteSpace: "nowrap" }}>MongoDB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: isMobile ? "1 1 auto" : "0 0 calc(36% - 4px)", minWidth: 0, overflow: "hidden" }}>
              <div style={{ ...panelStyle, padding: "10px 12px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: NAVY, marginBottom: 8 }}>Account Activity Split</div>
                <DonutChart segments={accountSegments} total={accountTotal} />
              </div>

              <div style={{ ...panelStyle, padding: "10px 12px", flex: 1, minHeight: 0, overflow: "hidden" }}>
                <div style={{ fontSize: 11, color: NAVY, marginBottom: 6 }}>Recent Activity</div>
                {recentActivity.length > 0 ? recentActivity.map((a, i) => (
                  <div key={a.id || `${a.user}-${i}`} style={{ display: "flex", gap: 7, alignItems: "flex-start", padding: "5px 0", borderBottom: i < recentActivity.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: activityColor(a.type), marginTop: 3, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: NAVY, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.user || "System update"}</div>
                      <div style={{ fontSize: 9, color: SLATE, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.action || "No details provided"}</div>
                      <div style={{ fontSize: 9, color: SLATE }}>{timeAgo(a.time)}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ fontSize: 10, color: SLATE, textAlign: "center", padding: "18px 0" }}>No recent activity yet.</div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => navigate("/admin/analytics")} style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: 8,
                  border: `1.5px solid ${NAVY}`,
                  background: "transparent",
                  color: NAVY,
                  fontSize: 11,
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,58,95,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >Analytics</button>
                <button onClick={() => navigate("/admin/appointments")} style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: 8,
                  border: "none",
                  background: ORANGE,
                  color: WHITE,
                  fontSize: 11,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#e07900"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; }}
                >
                  New Appt
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
