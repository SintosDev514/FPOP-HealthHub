import { useState, useEffect, useCallback } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const ORANGE = "#ea580c";
const TEAL   = "#0891b2";

const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IcoTotal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IcoConfirmed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IcoPending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoStaff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const pad = (n) => String(n).padStart(2, "0");
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const timeValue = (t) => {
  const m = String(t || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + parseInt(m[2], 10);
};

const fmtDay = (iso) => {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

const fmtShortDay = (iso) => {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const statusPill = (s) => {
  if (s === "Confirmed") return { bg: "rgba(34,197,94,0.1)", color: GREEN };
  if (s === "Pending") return { bg: "rgba(234,88,12,0.1)", color: ORANGE };
  if (s === "Completed") return { bg: "rgba(8,145,178,0.1)", color: TEAL };
  if (s === "Not Completed") return { bg: "rgba(249,115,22,0.1)", color: "#c2410c" };
  return { bg: "rgba(239,68,68,0.1)", color: RED };
};

const VIEWS = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "upcoming", label: "Upcoming" },
  { key: "all", label: "All" },
];

export default function Appointments({ isMobile }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceOptions, setServiceOptions] = useState([]);
  const [view, setView] = useState("today");

  useEffect(() => {
    fetch(`${__API_BASE__}/api/services`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setServiceOptions(d.services);
      })
      .catch(() => {});
  }, []);

  const fetchAppointments = useCallback(async (isPoll = false) => {
    if (!isPoll) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/appointments`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else if (!isPoll) {
        setError(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      if (!isPoll) setError(err.message || "Network error");
    } finally {
      if (!isPoll) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(() => fetchAppointments(true), 10000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleStatusChange = async (id, newStatus) => {
    const prev = appointments;
    setAppointments(appointments.map(a => a._id === id ? { ...a, status: newStatus } : a));
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/appointments/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });
      const data = await res.json();
      if (!data.success) {
        setAppointments(prev);
        alert(data.message || "Failed to update status");
      }
    } catch {
      setAppointments(prev);
      alert("Network error");
    }
  };

  const now = new Date();
  const todayISO = isoOf(now);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowISO = isoOf(tomorrowDate);

  const scoped = appointments.filter(appt => {
    const matchesSearch = appt.patient?.toLowerCase().includes(search.toLowerCase()) ||
                          appt.doctor?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || appt.department === deptFilter;
    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const matchView = (a) => {
    if (view === "today") return a.date === todayISO;
    if (view === "tomorrow") return a.date === tomorrowISO;
    if (view === "upcoming") return a.date > tomorrowISO;
    return true;
  };

  const inView = scoped.filter(matchView);

  const viewCounts = {
    today: scoped.filter(a => a.date === todayISO).length,
    tomorrow: scoped.filter(a => a.date === tomorrowISO).length,
    upcoming: scoped.filter(a => a.date > tomorrowISO).length,
    all: scoped.length,
  };

  const dayGroups = (() => {
    const byDate = {};
    for (const a of inView) (byDate[a.date] = byDate[a.date] || []).push(a);
    return Object.keys(byDate).sort().map(date => {
      const staffMap = {};
      for (const a of byDate[date]) {
        const key = a.staffId || a.doctor || "Unassigned";
        (staffMap[key] = staffMap[key] || { doctor: a.doctor, specialty: a.specialty, list: [] });
        staffMap[key].list.push(a);
      }
      const staffGroups = Object.values(staffMap)
        .map(g => ({ ...g, list: g.list.sort((x, y) => timeValue(x.time) - timeValue(y.time)) }))
        .sort((x, y) => x.doctor.localeCompare(y.doctor));
      return { date, count: byDate[date].length, staffGroups };
    });
  })();

  const total = inView.length;
  const confirmed = inView.filter(a => a.status === "Confirmed").length;
  const pending = inView.filter(a => a.status === "Pending").length;
  const staffOnDuty = new Set(inView.filter(a => a.status !== "Cancelled").map(a => a.staffId || a.doctor)).size;

  const stats = [
    { label: "Appointments", val: total, color: NAVY, bg: "rgba(30,58,95,0.06)", Icon: IcoTotal },
    { label: "Confirmed", val: confirmed, color: GREEN, bg: "rgba(34,197,94,0.08)", Icon: IcoConfirmed },
    { label: "Pending", val: pending, color: ORANGE, bg: "rgba(234,88,12,0.08)", Icon: IcoPending },
    { label: "Staff on Duty", val: staffOnDuty, color: TEAL, bg: "rgba(8,145,178,0.08)", Icon: IcoStaff },
  ];

  const renderActions = (appt) => (
    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
      {appt.status === "Pending" && (
        <button onClick={() => handleStatusChange(appt._id, "Confirmed")} style={{ border: "none", background: GREEN, color: "#fff", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Approve</button>
      )}
      {appt.status !== "Cancelled" && (
        <button onClick={() => handleStatusChange(appt._id, "Cancelled")} style={{ border: "1px solid rgba(239,68,68,0.4)", background: "transparent", color: RED, borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
      )}
      {appt.status === "Cancelled" && (
        <span style={{ fontSize: "11px", color: "#a0aec0", fontStyle: "italic" }}>No Actions</span>
      )}
    </div>
  );

  const renderApptRow = (appt) => {
    const pill = statusPill(appt.status);
    if (isMobile) {
      return (
        <div key={appt._id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(30,58,95,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(30,58,95,0.06)", color: NAVY, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, marginRight: 8 }}>{appt.time}</span>
              <span style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{appt.patient}</span>
            </div>
            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: pill.bg, color: pill.color, flexShrink: 0 }}>{appt.status}</span>
          </div>
          <div style={{ fontSize: 12, color: "#718096", marginBottom: 3 }}>
            <b style={{ color: NAVY }}>Contact:</b> {appt.phone || "—"}
          </div>
          <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 10 }}>
            <b style={{ color: NAVY }}>Service:</b>{" "}
            <span style={{ padding: "2px 8px", borderRadius: "12px", background: "rgba(30,58,95,0.06)", color: NAVY, fontSize: "11px" }}>{appt.department}</span>
          </div>
          {renderActions(appt)}
        </div>
      );
    }
    return (
      <div key={appt._id} style={{ display: "grid", gridTemplateColumns: "90px 1.3fr 1fr 1.1fr 120px 150px", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid rgba(30,58,95,0.04)", transition: "background 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <span style={{ background: "rgba(30,58,95,0.06)", color: NAVY, borderRadius: 6, padding: "3px 8px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>{appt.time}</span>
        <div>
          <div style={{ fontWeight: 600, color: NAVY }}>{appt.patient}</div>
        </div>
        <div style={{ color: "#4a5568" }}>{appt.phone || "—"}</div>
        <div>
          <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: "rgba(30,58,95,0.06)", color: NAVY }}>{appt.department}</span>
        </div>
        <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: pill.bg, color: pill.color, justifySelf: "start" }}>{appt.status}</span>
        {renderActions(appt)}
      </div>
    );
  };

  const renderStaffCard = (group, date) => (
    <div key={group.doctor + date} style={{ background: "#fff", borderRadius: "12px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 10px rgba(30,58,95,0.05)", overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "rgba(30,58,95,0.03)", borderBottom: "1px solid rgba(30,58,95,0.06)", flexWrap: "wrap" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {(group.doctor || "?").replace(/^Dr\.\s*/i, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{group.doctor || "Unassigned"}</div>
          {group.specialty && <div style={{ fontSize: 12, color: "#8a96a3" }}>{group.specialty}</div>}
        </div>
        <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "rgba(30,58,95,0.08)", color: NAVY }}>
          {group.list.length} appointment{group.list.length !== 1 ? "s" : ""}
        </span>
      </div>
      {isMobile ? (
        <div style={{ padding: "0 16px" }}>{group.list.map(renderApptRow)}</div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1.3fr 1fr 1.1fr 120px 150px", gap: 10, padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid rgba(30,58,95,0.06)" }}>
            {["Time", "Client", "Contact", "Service", "Status", "Actions"].map((h, i) => (
              <span key={h} style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#8a96a3", letterSpacing: "0.5px", textAlign: i === 5 ? "right" : "left" }}>{h}</span>
            ))}
          </div>
          {group.list.map(renderApptRow)}
        </div>
      )}
    </div>
  );

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>Appointments Monitoring</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Monitor who is booked with each staff member — today, tomorrow and upcoming days
        </p>
      </div>

      {/* Day selector tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {VIEWS.map(v => (
          <button key={v.key} onClick={() => setView(v.key)} style={{
            border: view === v.key ? "none" : "1px solid rgba(30,58,95,0.12)",
            background: view === v.key ? NAVY : "#fff",
            color: view === v.key ? "#fff" : NAVY,
            borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            {v.label}
            <span style={{
              background: view === v.key ? "rgba(255,255,255,0.2)" : "rgba(30,58,95,0.08)",
              color: view === v.key ? "#fff" : NAVY,
              borderRadius: 12, padding: "1px 8px", fontSize: 11, fontWeight: 700
            }}>{viewCounts[v.key]}</span>
          </button>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: "12px",
        marginBottom: "24px"
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid rgba(30,58,95,0.07)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#8a96a3", letterSpacing: "0.5px" }}>{stat.label}</span>
              <h3 style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, color: stat.color }}>{stat.val}</h3>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <stat.Icon />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "#fff",
        borderRadius: "16px 16px 0 0",
        padding: "20px 24px",
        border: "1px solid rgba(30,58,95,0.07)",
        borderBottom: "none",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#9aa5b4", pointerEvents: "none" }}><IcoSearch /></span>
          <input
            type="text"
            placeholder="Search client or service provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 16px 9px 38px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", fontSize: "13px", color: "#333", outline: "none", background: "#f7fafc", fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
          >
            <option value="All">All Services</option>
            {serviceOptions.map((service) => (
              <option key={service._id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#8a96a3", background: "#fff", borderRadius: "16px", border: "1px solid rgba(30,58,95,0.07)" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid rgba(30,58,95,0.1)", borderTopColor: NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: "13px" }}>Loading appointments...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: RED, background: "#fff", borderRadius: "16px", border: "1px solid rgba(239,68,68,0.15)" }}>
          <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600 }}>Failed to load appointments</p>
          <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#8a96a3" }}>{error}</p>
          <button onClick={fetchAppointments} style={{ border: "1px solid rgba(30,58,95,0.3)", background: "#fff", color: NAVY, borderRadius: "8px", padding: "6px 18px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Retry</button>
        </div>
      ) : dayGroups.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#8a96a3", background: "#fff", borderRadius: "0 0 16px 16px", border: "1px solid rgba(30,58,95,0.07)" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#4a5568" }}>No appointments found</p>
          <p style={{ margin: "6px 0 0", fontSize: "12px" }}>
            {view === "today" ? "Nothing is booked for today in this view." : view === "tomorrow" ? "Nothing is booked for tomorrow in this view." : "No bookings match the selected filters."}
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "0 0 16px 16px", border: "1px solid rgba(30,58,95,0.07)", padding: isMobile ? "8px 12px 16px" : "12px 20px 20px" }}>
          {dayGroups.map(g => (
            <div key={g.date}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "14px 0 12px", flexWrap: "wrap" }}>
                {g.date === todayISO && (
                  <span style={{ background: NAVY, color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>TODAY</span>
                )}
                {g.date === tomorrowISO && (
                  <span style={{ background: TEAL, color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>TOMORROW</span>
                )}
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: NAVY }}>{fmtDay(g.date)}</h3>
                <span style={{ fontSize: 12, color: "#8a96a3" }}>
                  {g.count} appointment{g.count !== 1 ? "s" : ""} · {g.staffGroups.length} staff
                </span>
              </div>
              {g.staffGroups.map(sg => renderStaffCard(sg, g.date))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
