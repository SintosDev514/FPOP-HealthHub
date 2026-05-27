import { useState } from "react";

const NAVY      = "#1E3A5F";
const GOLD      = "#F5C518";
const GREEN     = "#22c55e";
const RED       = "#ef4444";
const PURPLE    = "#7c3aed";
const ORANGE    = "#ea580c";

export default function Analytics({ isMobile }) {
  const [timeRange, setTimeRange] = useState("6M");

  const deptData = [
    { name: "Family Planning", count: 320, pct: 45, color: NAVY },
    { name: "OB-GYN", count: 180, pct: 25, color: PURPLE },
    { name: "General Medicine", count: 140, pct: 20, color: GREEN },
    { name: "Counselling", count: 70, pct: 10, color: GOLD }
  ];

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>Analytics &amp; Insights</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
            Detailed traffic, patient metrics and service performance data
          </p>
        </div>
        <select 
          value={timeRange} 
          onChange={e => setTimeRange(e.target.value)}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
        >
          <option value="1M">Last 30 Days</option>
          <option value="6M">Last 6 Months</option>
          <option value="1Y">Last Year</option>
        </select>
      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { title: "Monthly Revenue", val: "₱148,500", desc: "+14.2% vs last month", color: GREEN },
          { title: "Satisfaction Score", val: "4.9 / 5.0", desc: "Based on 320 reviews", color: GOLD },
          { title: "Avg. Consult Time", val: "18.5 mins", desc: "-1.5 mins vs standard", color: PURPLE },
          { title: "Patient Retention", val: "88.2%", desc: "+3.1% annual growth", color: NAVY }
        ].map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#8a96a3", textTransform: "uppercase" }}>{item.title}</span>
            <h3 style={{ margin: "6px 0 4px", fontSize: "26px", fontWeight: 800, color: NAVY }}>{item.val}</h3>
            <span style={{ fontSize: "12px", color: item.color, fontWeight: 600 }}>{item.desc}</span>
          </div>
        ))}
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

<div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 14px rgba(30,58,95,0.07)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Consultations by Department</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {deptData.map((dept, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  <span style={{ color: "#2d3748" }}>{dept.name}</span>
                  <span style={{ color: NAVY, fontWeight: 700 }}>{dept.count} bookings ({dept.pct}%)</span>
                </div>
                <div style={{ height: "8px", borderRadius: "99px", background: "rgba(30,58,95,0.06)" }}>
                  <div style={{ width: `${dept.pct}%`, height: "100%", background: dept.color, borderRadius: "99px", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

<div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 14px rgba(30,58,95,0.07)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Operational Performance Summary</h3>
          <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: "16px", marginBottom: "20px" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: NAVY }}>Capacity Utilization: High (89.4%)</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#718096" }}>The clinic is running near optimal resource scheduling. Peak scheduling times are Monday and Friday mornings.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${GREEN}`, paddingLeft: "16px", marginBottom: "20px" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: NAVY }}>Patient Attendance Rate: 94.2%</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#718096" }}>No-show rates decreased by 2.4% this month due to automated SMS reminder prompts.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${PURPLE}`, paddingLeft: "16px" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: NAVY }}>Top Consultation Type: Contraceptive Counselling</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#718096" }}>Family planning visits remain the highest volume driver, comprising 45% of total clinic consultations.</p>
          </div>
        </div>

      </div>

    </main>
  );
}
