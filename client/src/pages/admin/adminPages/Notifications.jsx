import { useState } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const GOLD   = "#F5C518";
const PURPLE = "#7c3aed";

export default function Notifications({ isMobile }) {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Update Scheduled", text: "Critical system security patches will be deployed at 12:00 AM. Expect up to 10 minutes of intermittent downtime.", time: "10 mins ago", category: "System", priority: "High", read: false },
    { id: 2, title: "New Appointment Request", text: "Patient Maria Santos booked a Family Planning consultation with Dr. Maria Santos for tomorrow at 09:30 AM.", time: "2 hrs ago", category: "Appointment", priority: "Medium", read: false },
    { id: 3, title: "Database Backup Complete", text: "Automated daily snapshot backup completed successfully. Total backup size: 1.2 GB.", time: "4 hrs ago", category: "System", priority: "Low", read: true },
    { id: 4, title: "Critical Inventory Alert", text: "Contraceptive inventory level of 'Implanon Implants' has fallen below the safety threshold (5 units remaining).", time: "1 day ago", category: "Alert", priority: "High", read: false },
    { id: 5, title: "User Account Suspended", text: "User account associated with emma@example.com was flagged and suspended due to multiple failed password attempts.", time: "2 days ago", category: "Security", priority: "High", read: true }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markSingleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.category === filter;
  });

  const getPriorityColor = (p) => {
    if (p === "High") return RED;
    if (p === "Medium") return GOLD;
    return GREEN;
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>System Notifications</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
            View system alerts, user activities, and scheduled tasks
          </p>
        </div>
        <button 
          onClick={markAllRead}
          style={{ background: "transparent", border: `1.5px solid rgba(30,58,95,0.12)`, color: NAVY, borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Mark all as read
        </button>
      </div>

<div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", "Unread", "System", "Appointment", "Alert"].map(tab => (
          <button 
            key={tab} 
            onClick={() => setFilter(tab)}
            style={{ 
              border: "none", 
              borderRadius: "20px", 
              padding: "6px 16px", 
              fontSize: "12px", 
              fontWeight: 600, 
              cursor: "pointer",
              background: filter === tab ? NAVY : "#fff",
              color: filter === tab ? "#fff" : "#5a6475",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map(n => (
            <div key={n.id} style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              padding: "20px 24px", 
              border: "1px solid rgba(30,58,95,0.07)", 
              borderLeft: `5px solid ${getPriorityColor(n.priority)}`,
              boxShadow: "0 2px 12px rgba(30,58,95,0.03)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              opacity: n.read ? 0.75 : 1
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: NAVY }}>{n.title}</h3>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(30,58,95,0.06)", color: NAVY, fontWeight: 700 }}>
                    {n.category}
                  </span>
                  {!n.read && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: RED }} />
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#4a5568", lineHeight: 1.4, marginBottom: "6px" }}>{n.text}</p>
                <span style={{ fontSize: "11px", color: "#a0aec0" }}>{n.time}</span>
              </div>

              {!n.read && (
                <button 
                  onClick={() => markSingleRead(n.id)}
                  style={{ border: "none", background: "rgba(34,197,94,0.1)", color: GREEN, padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.18)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)" }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", textCenter: "center", color: "#8a96a3", textAlign: "center", border: "1px solid rgba(30,58,95,0.07)" }}>
            No notifications found matching filter.
          </div>
        )}
      </div>

    </main>
  );
}
