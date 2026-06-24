import React, { useState, useEffect } from "react";

/* ─── SVG icon ─── */
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor"
    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
    viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const IC = {
  calendar:  "M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  users:     "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.2.5 4 2 4 4v1M8 11c-2.2.5-4 2-4 4v1",
  trend:     "m4 16 6-6 4 4 6-8M15 6h5v5",
  check:     "m8 12 3 3 6-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  dots:      "M5 12h.01M12 12h.01M19 12h.01",
  plus:      "M12 4v16m8-8H4",
  pulse:     "M4 12h3l2-7 4 14 2-7h5",
  chevR:     "m9 18 6-6-6-6",
  chevL:     "m15 18-6-6 6-6",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  clock:     "M12 6v6l4 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z",
  chevron:   "m9 18 6-6-6-6",
};

/* ─── palette ─── */
const TONES = {
  navy:   { bg: "#e8edf5", ic: "#1E3A5F", num: "#1E3A5F", sub: "#3b6ea8" },
  green:  { bg: "#dcfce7", ic: "#16a34a", num: "#15803d", sub: "#16a34a" },
  gold:   { bg: "#fef9c3", ic: "#ca8a04", num: "#a16207", sub: "#ca8a04" },
  orange: { bg: "#ffedd5", ic: "#ea580c", num: "#c2410c", sub: "#ea580c" },
};

/* ─── stat card ─── */
const StatCard = ({ title, value, sub, icon, tone = "navy" }) => {
  const c = TONES[tone];
  return (
    <div style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 8,
      padding: "8px 10px", boxShadow: "0 1px 3px rgba(0,0,0,.05)",
      display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
      <button style={{ position: "absolute", top: 6, right: 6, background: "none",
        border: "none", cursor: "pointer", color: "#d1d5db", padding: 0, lineHeight: 0 }}>
        <Ico d={IC.dots} size={13} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ background: c.bg, color: c.ic, borderRadius: 6, width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ico d={IC[icon]} size={13} />
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.05em", color: "#94a3b8", margin: 0, lineHeight: 1.2 }}>{title}</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: c.num, margin: 0, lineHeight: 1.1 }}>{value}</p>
        </div>
      </div>
      <p style={{ fontSize: 9, color: c.sub, margin: 0, fontWeight: 600, paddingLeft: 36 }}>{sub}</p>
    </div>
  );
};

/* ─── donut chart ─── */
const DonutChart = ({ data, total }) => {
  const r = 36, circ = 2 * Math.PI * r;
  let off = 0;
  const slices = data.map(d => {
    const dash = (d.value / (total || 1)) * circ;
    const s = { ...d, dash, gap: circ - dash, off };
    off += dash;
    return s;
  });
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 84 84" style={{ transform: "rotate(-90deg)" }}>
          {slices.map((s, i) => (
            <circle key={i} cx="42" cy="42" r={r} fill="none" stroke={s.color}
              strokeWidth="12" strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.off} />
          ))}
          <circle cx="42" cy="42" r="24" fill="white" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1E3A5F" }}>{total}</span>
          <span style={{ fontSize: 8, color: "#94a3b8" }}>Total</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 8, minWidth: 120 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color,
                display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#475569" }}>{d.label}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1e293b" }}>
              {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── mini calendar — compact version ─── */
const MiniCalendar = ({ appointments }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const apptDates = new Set(
    appointments.map(a => {
      const d = new Date(a.date);
      return d.getMonth() === month && d.getFullYear() === year ? d.getDate() : null;
    }).filter(Boolean)
  );
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const mn = new Date(year, month, 1).toLocaleString("default", { month: "long" });
  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  return (
    <div>
      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer",
          color: "#94a3b8", padding: 2, lineHeight: 0 }}>
          <Ico d={IC.chevL} size={12} />
        </button>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#1E3A5F" }}>{mn} {year}</span>
        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer",
          color: "#94a3b8", padding: 2, lineHeight: 0 }}>
          <Ico d={IC.chevR} size={12} />
        </button>
      </div>
      {/* day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", marginBottom: 1 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <span key={d} style={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{d}</span>
        ))}
      </div>
      {/* day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center" }}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasAppt = apptDates.has(d);
          return (
            <span key={i} style={{ position: "relative", display: "inline-flex", alignItems: "center",
              justifyContent: "center", width: 19, height: 19, borderRadius: "50%", margin: "0 auto",
              fontSize: 9, fontWeight: isToday ? 700 : 400,
              background: isToday ? "#1E3A5F" : "transparent",
              color: isToday ? "#fff" : "#475569", cursor: "pointer" }}>
              {d}
              {hasAppt && !isToday && (
                <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  width: 2.5, height: 2.5, borderRadius: "50%", background: "#F5C518" }} />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ─── status badge map ─── */
const SB = {
  completed: { bg: "#dcfce7", color: "#16a34a" },
  pending:   { bg: "#fef9c3", color: "#92400e" },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8" },
  cancelled: { bg: "#fee2e2", color: "#dc2626" },
};

/* ─── recent appointment row ─── */
const RecentApptRow = ({ appt }) => {
  const service = appt.serviceName || "General";
  const name = `${appt.patientId?.firstName || "–"} ${appt.patientId?.lastName || ""}`.trim();
  const b = SB[appt.status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px",
      borderRadius: 6, cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8edf5",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#1E3A5F", fontWeight: 700, fontSize: 9, flexShrink: 0 }}>
        {service.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service}</p>
        <p style={{ fontSize: 9, color: "#94a3b8", margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>{appt.date}</p>
        <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 20,
          background: b.bg, color: b.color, textTransform: "capitalize" }}>{appt.status}</span>
      </div>
      <Ico d={IC.chevron} size={11} />
    </div>
  );
};

/* ─── schedule row ─── */
const ScheduleRow = ({ appt }) => {
  const service = appt.serviceName || "General";
  const name = `${appt.patientId?.firstName || "–"} ${appt.patientId?.lastName || ""}`.trim();
  const time = appt.time || "09:00 AM";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0",
      borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ background: "#fef9c3", color: "#92400e", borderRadius: 4, padding: "2px 5px",
        fontSize: 8, fontWeight: 700, flexShrink: 0, minWidth: 48, textAlign: "center" }}>{time}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service}</p>
        <p style={{ fontSize: 8, color: "#94a3b8", margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
      </div>
    </div>
  );
};

/* ─── activity helpers ─── */
const actTime = appt => {
  const diff = Date.now() - new Date(appt.createdAt || appt.date).getTime();
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h}h ago`;
  return `${Math.floor(diff / 60000)}m ago`;
};
const ACOLOR = { completed: "#22c55e", pending: "#f59e0b", confirmed: "#3b82f6", cancelled: "#ef4444" };
const ALABEL = { completed: "Assessment completed", pending: "Appointment pending", confirmed: "Appointment confirmed", cancelled: "Appointment cancelled" };

const ActivityItem = ({ appt }) => {
  const color = ACOLOR[appt.status] || "#94a3b8";
  const label = ALABEL[appt.status] || "Appointment";
  const service = appt.serviceName || "General";
  const name = `${appt.patientId?.firstName || ""} ${appt.patientId?.lastName || ""}`.trim() || "Patient";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "4px 0",
      borderBottom: "1px solid #f8fafc" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: color + "22",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontSize: 9, color: "#94a3b8", margin: 0, whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis" }}>{service}</p>
        <p style={{ fontSize: 9, color: "#94a3b8", margin: 0, whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
      </div>
      <span style={{ fontSize: 8, color: "#94a3b8", flexShrink: 0, whiteSpace: "nowrap" }}>{actTime(appt)}</span>
    </div>
  );
};

/* ─── inventory line chart ─── */
const InventoryLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/inventory/tables", {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) { setLoading(false); return; }

        const items = data.tables.flatMap(t =>
          (t.categories || []).flatMap(c => c.items || [])
        );

        if (items.length === 0) { setLoading(false); return; }

        const receiptsTotal = items.reduce((s, i) => s + ((i.receipts || []).reduce((a, b) => a + (b || 0), 0)), 0);
        const issuancesTotal = items.reduce((s, i) => s + ((i.issuances || []).reduce((a, b) => a + (b || 0), 0)), 0);
        const endingTotal = items.reduce((s, i) => s + (i.ending || 0), 0);
        const beginningTotal = items.reduce((s, i) => s + (i.beginning || 0), 0);

        setChartData({ receiptsTotal, issuancesTotal, endingTotal, beginningTotal, itemCount: items.length });
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchInventory();
  }, []);

  const cardStyle = {
    background: "#fff", border: "1px solid #e8ecf2", borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,.05)",
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
        <span style={{ fontSize: 9, color: "#94a3b8" }}>Loading inventory…</span>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div style={{ ...cardStyle, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
        <span style={{ fontSize: 9, color: "#94a3b8" }}>No inventory data</span>
      </div>
    );
  }

  const points = [
    { label: "Beginning", value: chartData.beginningTotal },
    { label: "Receipts", value: chartData.receiptsTotal },
    { label: "Issuances", value: chartData.issuancesTotal },
    { label: "Ending", value: chartData.endingTotal },
  ];
  const maxVal = Math.max(...points.map(p => p.value), 1);
  const w = 220, h = 100, pad = 20;
  const xStep = (w - pad * 2) / (points.length - 1);

  const linePoints = points.map((p, i) => ({
    x: pad + i * xStep,
    y: h - pad - ((p.value / maxVal) * (h - pad * 2)),
  }));

  const pathD = linePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div style={{ ...cardStyle, padding: "8px 10px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexShrink: 0 }}>
        <svg width="13" height="13" fill="none" stroke="#1E3A5F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m21 8-9-5-9 5m18 0-9 5m9-5v13m0-13L3 8m9 5 9-5M3 8v8l9 5 9-5V8" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#1E3A5F", margin: 0 }}>Inventory Overview</span>
        <span style={{ fontSize: 8, color: "#94a3b8", marginLeft: "auto" }}>{chartData.itemCount} items</span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
        <svg width={w} height={h} style={{ flexShrink: 0 }}>
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e8ecf2" strokeWidth="1" />
          {linePoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1E3A5F" stroke="#fff" strokeWidth="1.5" />
          ))}
          <path d={pathD} fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[0.25, 0.5, 0.75].map(r => (
            <line key={r} x1={pad} y1={h - pad - (h - pad * 2) * r} x2={w - pad} y2={h - pad - (h - pad * 2) * r} stroke="#f1f5f9" strokeWidth="0.5" />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {points.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>{p.label}</span>
              <span style={{ color: "#1E3A5F", fontWeight: 700 }}>{p.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const StaffDashboardView = ({ profile, appointments = [], onStartAssessment, onViewSchedule }) => {
  const todayStr     = new Date().toISOString().split("T")[0];
  const todayCount   = appointments.filter(a => a.date === todayStr).length;
  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const upcomingCount  = appointments.filter(
    a => (a.status === "pending" || a.status === "confirmed") && a.date >= todayStr
  ).length;
  const totalAppts = appointments.length;

  const recentAppts  = [...appointments].sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)).slice(0, 5);
  const todayAppts   = appointments.filter(a => a.date === todayStr).slice(0, 2);
  const actItems     = [...appointments].sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)).slice(0, 4);

  const donutData = [
    { label: "Upcoming",  value: upcomingCount,  color: "#1E3A5F" },
    { label: "Pending",   value: pendingCount,   color: "#f59e0b" },
    { label: "Completed", value: completedCount, color: "#22c55e" },
  ];

  const initials = profile
    ? (`${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`).toUpperCase() || "S"
    : "S";

  /* shared styles */
  const card = {
    background: "#fff", border: "1px solid #e8ecf2", borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,.05)",
  };
  const hdg = { fontSize: 11, fontWeight: 800, color: "#1E3A5F", margin: 0 };
  const viewBtn = {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 10, color: "#1E3A5F", fontWeight: 600, padding: 0,
  };

  return (
    <main style={{
      height: "calc(100vh - 76px)", background: "#f0f4f8",
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'Inter','Poppins',sans-serif",
    }}>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        padding: "8px 12px", gap: 6, overflow: "hidden",
      }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E3A5F", margin: 0, lineHeight: 1.2 }}>Dashboard Overview</h2>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>
              Welcome back, {profile?.firstName || profile?.name || "Staff"}!
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} />
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, flexShrink: 0 }}>
          <StatCard title="Total Appointments" value={totalAppts}      sub={`${upcomingCount} upcoming`}  icon="calendar" tone="navy"   />
          <StatCard title="Today"              value={todayCount}      sub={`${todayCount} appointments`} icon="trend"    tone="green"  />
          <StatCard title="Pending"            value={pendingCount}    sub="Awaiting confirmation"        icon="users"    tone="gold"   />
          <StatCard title="Completed"          value={completedCount}  sub="Successfully done"            icon="check"    tone="orange" />
        </div>

        {/* ── ROW 3: appointment overview + inventory chart + quick stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 6, flexShrink: 0 }}>

          {/* Appointment Overview */}
          <div style={{ ...card, padding: "8px 10px", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Ico d={IC.pulse} size={13} />
                <span style={hdg}>Appointment Overview</span>
              </div>
              <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>This Month</span>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
              <DonutChart data={donutData} total={totalAppts} />
            </div>
          </div>

          {/* Inventory Line Chart */}
          <InventoryLineChart />

          {/* Quick Stats */}
          <div style={{ background: "linear-gradient(160deg,#1a3254 0%,#0f2038 100%)", borderRadius: 10,
            padding: "10px 12px", color: "#fff", display: "flex", flexDirection: "column", gap: 8,
            boxShadow: "0 4px 16px rgba(21,44,74,.25), inset 0 1px 0 rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(255,255,255,.08)", paddingBottom: 7 }}>
              <svg width="12" height="12" fill="none" stroke="#F5C518" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3v18h18M7 16l4-8 4 4 4-6" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.02em" }}>Quick Stats</span>
            </div>
            {[
              { label: "Today's Appointments", value: todayCount,     max: Math.max(todayCount, 10),                      color: "#3b82f6", icon: IC.calendar },
              { label: "Pending",              value: pendingCount,   max: Math.max(pendingCount, 10),                    color: "#f59e0b", icon: IC.users },
              { label: "Completed",            value: completedCount, max: Math.max(completedCount, totalAppts, 1),       color: "#22c55e", icon: IC.check },
            ].map(({ label, value, max, color, icon }, idx) => (
              <div key={label}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: `${color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Ico d={icon} size={10} style={{ color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,.65)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>{value}</span>
                    </div>
                    <div style={{ marginTop: 4, height: 3, borderRadius: 99, background: "rgba(255,255,255,.1)" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${color},${color}88)`,
                        width: `${Math.min((value / max) * 100, 100)}%`, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
                    </div>
                  </div>
                </div>
                {idx < 2 && <div style={{ height: 1, background: "rgba(255,255,255,.04)", marginTop: 6 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 4: schedule + recent appointments + activity  ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, flex: 1, minHeight: 0 }}>

          {/* Upcoming Schedule */}
          <div style={{ ...card, padding: "8px 10px", display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexShrink: 0 }}>
              <Ico d={IC.calendar} size={13} />
              <span style={hdg}>Upcoming Schedule</span>
            </div>
            <div style={{ flexShrink: 0 }}>
              <MiniCalendar appointments={appointments} />
            </div>
            <div style={{ flex: 1, overflow: "hidden", marginTop: 5 }}>
              {todayAppts.length === 0
                ? <p style={{ fontSize: 9, color: "#94a3b8", textAlign: "center", margin: "4px 0" }}>No appointments today</p>
                : todayAppts.map(a => <ScheduleRow key={a._id} appt={a} />)
              }
            </div>
            {/* inline footer */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 8, color: "#cbd5e1" }}>© 2026 Your Company. All rights reserved.</span>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 8, color: "#94a3b8", cursor: "pointer" }}>Privacy Policy</span>
                <span style={{ fontSize: 8, color: "#94a3b8", cursor: "pointer" }}>Terms of Service</span>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div style={{ ...card, padding: "8px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Ico d={IC.clock} size={13} />
                <span style={hdg}>Recent Appointments</span>
              </div>
              <button onClick={onViewSchedule} style={viewBtn}>View all</button>
            </div>
            <div>
              {recentAppts.length === 0
                ? <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 10, padding: "8px 0", margin: 0 }}>No appointments yet.</p>
                : recentAppts.map(a => <RecentApptRow key={a._id} appt={a} />)
              }
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ ...card, padding: "8px 10px", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Ico d={IC.activity} size={13} />
                <span style={hdg}>Recent Activity</span>
              </div>
              <button onClick={onViewSchedule} style={viewBtn}>View all</button>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              {actItems.length === 0
                ? <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 10, paddingTop: 10, margin: 0 }}>No recent activity</p>
                : actItems.map(a => <ActivityItem key={a._id} appt={a} />)
              }
            </div>
            {actItems.length > 0 && (
              <button onClick={onViewSchedule} style={{ ...viewBtn, fontWeight: 700, textAlign: "center",
                marginTop: 4, paddingTop: 4, borderTop: "1px solid #f1f5f9", width: "100%", display: "block" }}>
                View all activity
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default StaffDashboardView;
