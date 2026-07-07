import { useState, useEffect } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const GOLD   = "#F5C518";

export default function Notifications({ isMobile }) {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("__API_BASE__/api/admin/notifications", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("__API_BASE__/api/admin/notifications/read-all", {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch {}
  };

  const markSingleRead = async (id) => {
    try {
      const res = await fetch(`__API_BASE__/api/admin/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch {}
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.category === filter;
  });

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day ago`;
  };

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
        {["All", "Unread", "System", "User", "Appointment", "Alert"].map(tab => (
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
        {loading ? (
          <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", textAlign: "center", color: "#8a96a3", border: "1px solid rgba(30,58,95,0.07)" }}>
            Loading notifications...
          </div>
        ) : filteredNotifs.length > 0 ? (
          filteredNotifs.map(n => (
            <div key={n._id} style={{ 
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
                  <span style={{ fontSize: "11px", color: "#a0aec0" }}>{timeAgo(n.createdAt)}</span>
              </div>

              {!n.read && (
                <button 
                  onClick={() => markSingleRead(n._id)}
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
