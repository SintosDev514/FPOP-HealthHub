import { useState } from "react";

/* ─── FPOP Brand Tokens ─────────────────────────────────────── */
const NAVY      = "#1E3A5F";
const GOLD      = "#F5C518";
const GREEN     = "#22c55e";
const RED       = "#ef4444";
const PURPLE    = "#7c3aed";

export default function Reports({ isMobile }) {
  const [exportingId, setExportingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [successId, setSuccessId] = useState(null);

  const reportTemplates = [
    { id: 1, title: "Monthly Clinical Consultation Summary", desc: "Aggregated volumes of appointments, departments, and patient demographics.", category: "Operational" },
    { id: 2, title: "Financial Billing & Revenue Report", desc: "Breakdown of consultation fees, methods of payment, and outstanding balances.", category: "Finance" },
    { id: 3, title: "Staff Attendance & Performance Analysis", desc: "Consultation durations, attendance metrics, and service delivery benchmarks for physicians.", category: "Staff" },
    { id: 4, title: "Contraceptive Supply & Inventory Report", desc: "Current stock status of family planning supplies, distribution logs, and reorder levels.", category: "Inventory" },
    { id: 5, title: "Patient Feedback & Satisfaction Metrics", desc: "Aggregated review score details, comment sentiments, and clinic recommendations.", category: "Quality" },
  ];

  const handleExport = (id) => {
    setExportingId(id);
    setProgress(0);
    setSuccessId(null);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setExportingId(null);
          setSuccessId(id);
          // Auto hide success badge after 3 seconds
          setTimeout(() => setSuccessId(null), 3000);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>
      
      {/* Title */}
      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>System Reports</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Generate and export clinical activity, billing and operational summaries
        </p>
      </div>

      {/* Grid List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reportTemplates.map(report => (
          <div key={report.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 12px rgba(30,58,95,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <span style={{ 
                padding: "3px 8px", 
                borderRadius: "4px", 
                fontSize: "10px", 
                fontWeight: 700, 
                textTransform: "uppercase",
                background: report.category === "Operational" ? "rgba(30,58,95,0.08)" : report.category === "Finance" ? "rgba(34,197,94,0.08)" : "rgba(124,58,237,0.08)",
                color: report.category === "Operational" ? NAVY : report.category === "Finance" ? GREEN : PURPLE,
                display: "inline-block",
                marginBottom: "8px"
              }}>
                {report.category}
              </span>
              <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: NAVY }}>{report.title}</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#718096", lineHeight: 1.4 }}>{report.desc}</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "180px", justifyContent: "flex-end" }}>
              {exportingId === report.id ? (
                <div style={{ width: "100%", maxWidth: "160px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", fontWeight: 600, color: NAVY }}>
                    <span>Exporting...</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(30,58,95,0.08)", borderRadius: "99px" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: GREEN, borderRadius: "99px", transition: "width 0.1s" }} />
                  </div>
                </div>
              ) : (
                <>
                  {successId === report.id ? (
                    <span style={{ color: GREEN, fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      Downloaded
                    </span>
                  ) : (
                    <>
                      <select style={{ padding: "6px 12px", borderRadius: "6px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                        <option>PDF Format</option>
                        <option>Excel Format</option>
                        <option>CSV Format</option>
                      </select>
                      <button 
                        onClick={() => handleExport(report.id)}
                        style={{ background: NAVY, color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(30,58,95,0.15)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#152c4a"}
                        onMouseLeave={e => e.currentTarget.style.background = NAVY}
                      >
                        Export
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
