import { useState, useEffect, useCallback } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const GOLD   = "#F5C518";
const ORANGE = "#ea580c";

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

const IcoCancelled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

export default function Appointments({ isMobile }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/admin/appointments", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id, newStatus) => {
    const prev = appointments;
    setAppointments(appointments.map(a => a._id === id ? { ...a, status: newStatus } : a));
    try {
      const res = await fetch(`http://localhost:5000/api/admin/appointments/${id}/status`, {
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

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.patient?.toLowerCase().includes(search.toLowerCase()) || 
                          appt.doctor?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || appt.department === deptFilter;
    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Stats counters
  const total = appointments.length;
  const confirmed = appointments.filter(a => a.status === "Confirmed").length;
  const pending = appointments.filter(a => a.status === "Pending").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

<div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>Appointments</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Schedule, monitor and manage patient consultation bookings
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: "12px",
        marginBottom: "24px"
      }}>
        {[
          { label: "Total Bookings", val: total, color: NAVY, bg: "rgba(30,58,95,0.06)", Icon: IcoTotal },
          { label: "Confirmed", val: confirmed, color: GREEN, bg: "rgba(34,197,94,0.08)", Icon: IcoConfirmed },
          { label: "Pending", val: pending, color: ORANGE, bg: "rgba(234,88,12,0.08)", Icon: IcoPending },
          { label: "Cancelled", val: cancelled, color: RED, bg: "rgba(239,68,68,0.08)", Icon: IcoCancelled }
        ].map((stat, i) => (
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
            placeholder="Search patient or doctor..." 
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
            <option value="All">All Departments</option>
            <option value="Family Planning">Family Planning</option>
            <option value="OB-GYN">OB-GYN</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
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
      ) : isMobile ? (
        /* ── Mobile: card list ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredAppointments.length > 0 ? filteredAppointments.map(appt => (
            <div key={appt._id} style={{ background: "#fff", borderRadius: "14px", padding: "16px", boxShadow: "0 2px 10px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "14px" }}>{appt.patient}</div>
                  <div style={{ fontSize: "12px", color: "#718096", marginTop: "2px" }}>{appt.phone}</div>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: appt.status === "Confirmed" ? "rgba(34,197,94,0.1)" : appt.status === "Pending" ? "rgba(234,88,12,0.1)" : "rgba(239,68,68,0.1)", color: appt.status === "Confirmed" ? GREEN : appt.status === "Pending" ? ORANGE : RED, flexShrink: 0 }}>
                  {appt.status}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#4a5568", marginBottom: "4px" }}>
                <b style={{ color: NAVY }}>Doctor:</b> {appt.doctor}
              </div>
              <div style={{ fontSize: "12px", color: "#4a5568", marginBottom: "4px" }}>
                <b style={{ color: NAVY }}>Dept:</b> <span style={{ padding: "2px 8px", borderRadius: "12px", background: "rgba(30,58,95,0.06)", color: NAVY, fontSize: "11px" }}>{appt.department}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#718096", marginBottom: "10px" }}>
                <b style={{ color: NAVY }}>Schedule:</b> {appt.datetime}
              </div>
              <div style={{ display: "flex", gap: "8px", paddingTop: "10px", borderTop: "1px solid rgba(30,58,95,0.06)" }}>
                {appt.status === "Pending" && (
                  <button onClick={() => handleStatusChange(appt._id, "Confirmed")} style={{ border: "none", background: GREEN, color: "#fff", borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Approve</button>
                )}
                {appt.status !== "Cancelled" && (
                  <button onClick={() => handleStatusChange(appt._id, "Cancelled")} style={{ border: "1px solid rgba(239,68,68,0.4)", background: "transparent", color: RED, borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                )}
                {appt.status === "Cancelled" && (
                  <span style={{ fontSize: "11px", color: "#a0aec0", fontStyle: "italic" }}>No Actions</span>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: "center", padding: "30px", color: "#8a96a3", background: "#fff", borderRadius: "14px" }}>No appointments found.</div>
          )}
        </div>
      ) : (
        /* ── Desktop: table ── */
        <div style={{ 
          background: "#fff", 
          borderRadius: "0 0 16px 16px", 
          boxShadow: "0 2px 14px rgba(30,58,95,0.07)", 
          border: "1px solid rgba(30,58,95,0.07)",
          overflowX: "auto"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid rgba(30,58,95,0.07)" }}>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Patient</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Contact</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Physician</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Department</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Schedule</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appt => (
                  <tr key={appt._id} style={{ borderBottom: "1px solid rgba(30,58,95,0.04)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ fontWeight: 600, color: NAVY }}>{appt.patient}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#4a5568" }}>{appt.phone}</td>
                    <td style={{ padding: "16px 24px", color: "#2d3748", fontWeight: 500 }}>{appt.doctor}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: "rgba(30,58,95,0.06)", color: NAVY }}>{appt.department}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#718096" }}>{appt.datetime}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: appt.status === "Confirmed" ? "rgba(34,197,94,0.1)" : appt.status === "Pending" ? "rgba(234,88,12,0.1)" : "rgba(239,68,68,0.1)", color: appt.status === "Confirmed" ? GREEN : appt.status === "Pending" ? ORANGE : RED }}>{appt.status}</span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "30px", color: "#8a96a3", textAlign: "center" }}>No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
