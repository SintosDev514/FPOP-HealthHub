import { useState, useEffect, useCallback } from "react";

const NAVY  = "#1E3A5F";
const NAVY2 = "#2a4a6e";
const GOLD  = "#e8a838";
const GREEN = "#16a34a";
const RED   = "#dc2626";
const TEAL  = "#0891b2";

const Ic = ({ d, w = 18 }) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const icons = {
  bookings: <Ic d={["M3 4h18", "M3 8h18", "M3 12h18", "M3 16h18", "M3 20h18"]} w={20} />,
  completed: <Ic d={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01 9 11.01"]} w={20} />,
  pending: <Ic d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"]} w={20} />,
  attendance: <Ic d={["M9 12l2 2 4-4", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"]} w={20} />,
};

function Donut({ segments, total, size = 160 }) {
  const r = 36;
  const cx = 40, cy = 40;
  const paths = [];
  let cum = 0;
  for (const s of segments) {
    if (s.count === 0) continue;
    const start = (cum / total) * 360 - 90;
    cum += s.count;
    const end = (cum / total) * 360 - 90;
    const sr = (start * Math.PI) / 180;
    const er = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sr);
    const y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er);
    const y2 = cy + r * Math.sin(er);
    const large = end - start > 180 ? 1 : 0;
    paths.push({ d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, stroke: s.color });
  }
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth="10" fill="none" strokeLinecap="butt" />
      ))}
      <circle cx="40" cy="40" r="24" fill="#fff" />
      <text x="40" y="37" textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>{total}</text>
      <text x="40" y="49" textAnchor="middle" fontSize="4.5" fontWeight="500" fill="#94a3b8">total</text>
    </svg>
  );
}

export default function Analytics({ isMobile }) {
  const [range, setRange] = useState("6M");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/analytics`, { credentials: "include" });
      const j = await res.json();
      if (j.success) setData(j.analytics);
      else setErr(j.message);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: NAVY, borderRadius: "50%", animation: "a .8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Loading analytics...</p>
          <style>{`@keyframes a{to{transform:rotate(360deg)}}`}</style>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: RED, margin: "0 auto 12px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Failed to load analytics</p>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#94a3b8" }}>{err}</p>
          <button onClick={fetchData} style={{ border: "none", background: NAVY, color: "#fff", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Retry</button>
        </div>
      </main>
    );
  }

  const { overview, byDepartment, monthlyTrend, daily, performance } = data;

  const cards = [
    { icon: icons.bookings, label: "Total Bookings", value: String(overview.total), sub: `${daily.today} today`, color: NAVY, bg: "#eef2f6" },
    { icon: icons.completed, label: "Completed", value: `${overview.completedRate}%`, sub: `${overview.completed + overview.confirmed} of ${overview.total}`, color: GREEN, bg: "#f0fdf4" },
    { icon: icons.pending, label: "Pending", value: String(overview.pending), sub: "awaiting confirmation", color: "#d97706", bg: "#fffbeb" },
    { icon: icons.attendance, label: "Attendance", value: `${performance.attendanceRate}%`, sub: `peak ${performance.peakDay}`, color: TEAL, bg: "#ecfeff" },
  ];

  const statusSegments = [
    { label: "Completed", count: overview.completed, color: GREEN },
    { label: "Confirmed", count: overview.confirmed, color: "#0ea5e9" },
    { label: "Pending", count: overview.pending, color: "#d97706" },
    { label: "Cancelled", count: overview.cancelled, color: RED },
  ];
  const statusTotal = statusSegments.reduce((s, x) => s + x.count, 0) || 1;

  const maxM = Math.max(...monthlyTrend.map(m => m.count), 1);
  const deptColors = [NAVY, "#7c3aed", GREEN, GOLD, "#d97706", RED, TEAL, "#ec4899"];

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f8fafc" }}>

      {/* â”€â”€ Header â”€â”€ */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: NAVY, letterSpacing: "-0.3px" }}>Analytics</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>Key metrics from your appointment data</p>
        </div>
        <select value={range} onChange={e => setRange(e.target.value)}
          style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, color: NAVY, outline: "none", cursor: "pointer" }}>
          <option value="1M">Last 30 days</option>
          <option value="6M">Last 6 months</option>
          <option value="1Y">Last year</option>
        </select>
      </div>

      {/* â”€â”€ Metric cards â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #eef2f6", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".4px" }}>{c.label}</span>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Row 2: Status donut + Monthly trend â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #eef2f6", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: NAVY }}>Appointment Status</h3>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 32, flexWrap: "wrap" }}>
            <Donut segments={statusSegments} total={statusTotal} />
            <div style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", gap: 8 }}>
              {statusSegments.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: "#475569" }}>{s.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{s.count}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 36, textAlign: "right" }}>{((s.count / statusTotal) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #eef2f6", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: NAVY }}>Monthly Bookings</h3>
          {monthlyTrend.length > 0 ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150, paddingTop: 8 }}>
              {monthlyTrend.map((m, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: NAVY }}>{m.count}</span>
                  <div style={{ width: "100%", maxWidth: 36, height: `${Math.max((m.count / maxM) * 130, 3)}px`, background: NAVY, borderRadius: "3px 3px 0 0", opacity: 0.7 }} />
                  <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>{m.month.length >= 7 ? m.month.substring(5) + "/" + m.month.substring(2, 4) : m.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "40px 0" }}>No data yet.</p>
          )}
        </div>

      </div>

      {/* â”€â”€ Row 3: Department bars + Performance â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #eef2f6", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: NAVY }}>Consultations by Department</h3>
          {byDepartment.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {byDepartment.map((d, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>
                    <span style={{ color: "#334155" }}>{d.name}</span>
                    <span style={{ color: NAVY, fontWeight: 600 }}>{d.count} ({d.pct}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ width: `${d.pct}%`, height: "100%", background: deptColors[i % deptColors.length], borderRadius: 99, transition: "width .8s" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "40px 0" }}>No data yet.</p>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #eef2f6", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: NAVY }}>Performance Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Pending reviews", val: `${overview.pending}`, color: GOLD, desc: overview.pending > 0 ? `${overview.pending} appointment${overview.pending !== 1 ? "s" : ""} awaiting confirmation.` : "All appointments have been reviewed." },
              { label: "Attendance rate", val: `${performance.attendanceRate}%`, color: GREEN, desc: `${overview.completed + overview.confirmed} attended of ${overview.total} total. Peak day: ${performance.peakDay}.` },
              { label: "Top service", val: performance.topDepartment.name, color: "#7c3aed", desc: `${performance.topDepartment.count} booking${performance.topDepartment.count !== 1 ? "s" : ""} (${performance.topDepartment.pct}%) across ${performance.totalDepts} services.` },
              { label: "Today", val: `${daily.today}`, color: TEAL, desc: daily.today > 0 ? "Check Appointments page for details." : "No appointments scheduled." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".3px" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{item.val}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </main>
  );
}
