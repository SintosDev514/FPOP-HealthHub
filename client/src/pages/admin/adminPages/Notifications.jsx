import { useState, useEffect, useRef } from "react";

const NAVY  = "#1E3A5F";
const GREEN = "#22c55e";
const RED   = "#ef4444";

export default function Notifications({ open, onClose, isMobile }) {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${__API_BASE__}/api/admin/notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/notifications/read-all`, {
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
      const res = await fetch(`${__API_BASE__}/api/admin/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch {}
  };

  const deleteNotification = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch {}
    setDeleting(null);
  };

  const clearAll = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/notifications/clear-all`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setNotifications([]);
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
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: isMobile ? "92vw" : "420px",
        maxHeight: "520px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: NAVY }}>Notifications</h3>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={markAllRead}
              style={{
                background: "transparent",
                border: "none",
                color: NAVY,
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(30,58,95,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              style={{
                background: "transparent",
                border: "none",
                color: RED,
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
          {["All", "Unread", "System", "User", "Appointment", "Alert"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: filter === tab ? NAVY : "#f1f4f8",
                color: filter === tab ? "#fff" : "#5a6475",
                transition: "all 0.15s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "380px" }}>
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#8a96a3", fontSize: "13px" }}>
            Loading...
          </div>
        ) : filteredNotifs.length > 0 ? (
          filteredNotifs.map(n => (
            <div
              key={n._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 18px",
                borderBottom: "1px solid #f5f5f5",
                background: n.read ? "#fff" : "rgba(30,58,95,0.03)",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? "#fff" : "rgba(30,58,95,0.03)"}
            >
              {/* Icon */}
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: n.category === "System" ? "rgba(30,58,95,0.1)"
                  : n.category === "Alert" ? "rgba(239,68,68,0.1)"
                  : n.category === "Appointment" ? "rgba(34,197,94,0.1)"
                  : "rgba(245,197,24,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={
                  n.category === "System" ? NAVY
                  : n.category === "Alert" ? RED
                  : n.category === "Appointment" ? GREEN
                  : "#b8860b"
                } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: NAVY }}>{n.title}</span>
                  {!n.read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: RED, flexShrink: 0 }} />}
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#4a5568", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.text}</p>
                <span style={{ fontSize: "10px", color: "#a0aec0", marginTop: "2px", display: "inline-block" }}>{timeAgo(n.createdAt)}</span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                {!n.read && (
                  <button
                    onClick={() => markSingleRead(n._id)}
                    style={{
                      border: "none",
                      background: "rgba(34,197,94,0.1)",
                      color: GREEN,
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  disabled={deleting === n._id}
                  style={{
                    border: "none",
                    background: deleting === n._id ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
                    color: RED,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    cursor: deleting === n._id ? "not-allowed" : "pointer",
                    opacity: deleting === n._id ? 0.6 : 1
                  }}
                >
                  {deleting === n._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#8a96a3", fontSize: "13px" }}>
            No notifications
          </div>
        )}
      </div>
    </div>
  );
}
