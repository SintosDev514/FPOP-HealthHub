import { useState, useEffect } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const PURPLE = "#7c3aed";

const roleDisplay = {
  admin: "Admin",
  staff: "Staff",
  patient: "User",
};

const roleOptions = ["patient", "staff", "admin"];

const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const avatarColors = [PURPLE, "#3b82f6", "#6366f1", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6"];

export default function UserManagement({ isMobile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("patient");
  const [saving, setSaving] = useState(false);
  const [confirmRole, setConfirmRole] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    // Only show patients and admins (staff managed in Staff Management)
    if (user.role === "staff") return false;
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const displayRole = roleDisplay[user.role] || user.role;
    const matchesRole = roleFilter === "All" || displayRole === roleFilter;
    const userStatus = user.isSuspended ? "Suspended" : "Active";
    const matchesStatus = statusFilter === "All" || userStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getColor = (name) => {
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newUserEmail || !newUserPassword) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => [data.user, ...prev]);
        setNewFirstName("");
        setNewLastName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("patient");
        setShowAddModal(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    const user = confirmDelete;
    setConfirmDelete(null);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete user");
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = !user.isSuspended;
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users/${user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isSuspended: newStatus } : u))
        );
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to update user status");
    }
  };

  const handleRoleChange = (user, newRole) => {
    setConfirmRole({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!confirmRole) return;
    const { user, newRole } = confirmRole;
    setConfirmRole(null);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users/${user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to update user role");
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toISOString().split("T")[0];
  };

  return (
    <main
      style={{
        flex: 1,
        padding: isMobile ? "20px 16px" : "28px 32px",
        overflowY: "auto",
        background: "#f1f4f8",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "26px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "22px" : "26px",
              fontWeight: 800,
              color: NAVY,
              letterSpacing: "-0.5px",
            }}
          >
            Client Management
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
            Manage patients and admins
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: NAVY,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(30,58,95,0.25)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#152c4a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Client
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
          border: "1px solid rgba(30,58,95,0.07)",
          borderBottom: "none",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
          <span
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9aa5b4",
              pointerEvents: "none",
            }}
          >
            <IcoSearch />
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 16px 9px 38px",
              borderRadius: "8px",
              border: "1.5px solid rgba(30,58,95,0.12)",
              fontSize: "13px",
              color: "#333",
              outline: "none",
              background: "#f7fafc",
              fontFamily: "'Poppins',sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1.5px solid rgba(30,58,95,0.12)",
              background: "#fff",
              fontSize: "13px",
              color: "#4a5568",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1.5px solid rgba(30,58,95,0.12)",
              background: "#fff",
              fontSize: "13px",
              color: "#4a5568",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fff",
            padding: "12px 24px",
            border: "1px solid rgba(239,68,68,0.2)",
            borderTop: "none",
            color: RED,
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            border: "1px solid rgba(30,58,95,0.07)",
            padding: "40px",
            textAlign: "center",
            color: "#8a96a3",
          }}
        >
          Loading users...
        </div>
      ) : isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const userStatus = user.isSuspended ? "Suspended" : "Active";
              const displayRole = roleDisplay[user.role] || user.role;
              const bg = getColor(user.name);
              return (
                <div
                  key={user._id}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "16px",
                    boxShadow: "0 2px 10px rgba(30,58,95,0.07)",
                    border: "1px solid rgba(30,58,95,0.07)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = (user.name || "?").charAt(0); e.currentTarget.parentElement.style.color = "#fff"; e.currentTarget.parentElement.style.fontWeight = 700; e.currentTarget.parentElement.style.fontSize = "16px"; }} />
                      ) : (
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{(user.name || "?").charAt(0)}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: NAVY,
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: 600,
                          background:
                            displayRole === "Admin"
                              ? "rgba(124,58,237,0.1)"
                              : displayRole === "Staff"
                                ? "rgba(59,130,246,0.1)"
                                : "rgba(107,114,128,0.1)",
                          color:
                            displayRole === "Admin"
                              ? PURPLE
                              : displayRole === "Staff"
                                ? "#3b82f6"
                                : "#6b7280",
                        }}
                      >
                        {displayRole}
                      </span>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: 600,
                          background:
                            userStatus === "Active"
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(239,68,68,0.1)",
                          color: userStatus === "Active" ? GREEN : RED,
                        }}
                      >
                        {userStatus}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "10px",
                      borderTop: "1px solid rgba(30,58,95,0.06)",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#a0aec0" }}>
                      Joined {formatDate(user.joinDate)}
                    </span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => toggleStatus(user)}
                        title={userStatus === "Active" ? "Suspend" : "Unsuspend"}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: userStatus === "Active" ? "#ea580c" : GREEN,
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                        }}
                      >
                        {userStatus === "Active" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        title="Delete"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: RED,
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#8a96a3",
                background: "#fff",
                borderRadius: "14px",
              }}
            >
              No users match the criteria.
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            boxShadow: "0 2px 14px rgba(30,58,95,0.07)",
            border: "1px solid rgba(30,58,95,0.07)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid rgba(30,58,95,0.07)" }}>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>User</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Role</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Join Date</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userStatus = user.isSuspended ? "Suspended" : "Active";
                  const displayRole = roleDisplay[user.role] || user.role;
                  const bg = getColor(user.name);
                  return (
                    <tr
                      key={user._id}
                      style={{ borderBottom: "1px solid rgba(30,58,95,0.04)", transition: "background 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              flexShrink: 0,
                              background: bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {user.avatar ? (
                              <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = (user.name || "?").charAt(0); e.currentTarget.parentElement.style.color = "#fff"; e.currentTarget.parentElement.style.fontWeight = 700; e.currentTarget.parentElement.style.fontSize = "14px"; }} />
                            ) : (
                              <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{(user.name || "?").charAt(0)}</span>
                            )}
                          </div>
                          <span style={{ fontWeight: 600, color: NAVY }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", color: "#4a5568" }}>{user.email}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            background:
                              displayRole === "Admin"
                                ? "rgba(124,58,237,0.1)"
                                : displayRole === "Staff"
                                  ? "rgba(59,130,246,0.1)"
                                  : "rgba(107,114,128,0.1)",
                            color:
                              displayRole === "Admin"
                                ? PURPLE
                                : displayRole === "Staff"
                                  ? "#3b82f6"
                                  : "#6b7280",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {roleOptions.map((r) => (
                            <option key={r} value={r}>
                              {roleDisplay[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background:
                              userStatus === "Active"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(239,68,68,0.1)",
                            color: userStatus === "Active" ? GREEN : RED,
                          }}
                        >
                          {userStatus}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", color: "#718096" }}>
                        {formatDate(user.joinDate)}
                      </td>
                      <td style={{ padding: "14px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => toggleStatus(user)}
                            title={userStatus === "Active" ? "Suspend" : "Unsuspend"}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: userStatus === "Active" ? "#ea580c" : GREEN,
                              cursor: "pointer",
                              padding: "4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {userStatus === "Active" ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                              </svg>
                            ) : (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: RED,
                              cursor: "pointer",
                              padding: "4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "30px", color: "#8a96a3", textAlign: "center" }}>
                    No users match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 20px", color: NAVY, fontWeight: 800, fontSize: "18px" }}>
              Add New User
            </h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    outline: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    outline: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    outline: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    outline: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  System Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    outline: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                >
                  <option value="patient">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    background: "#fff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "#4a5568",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "8px 20px",
                    border: "none",
                    background: saving ? "#94a3bd" : "#3b82f6",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
                  }}
                >
                  {saving ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmRole && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(245,197,24,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 6px", color: NAVY, fontWeight: 800, fontSize: "17px" }}>
              Change User Role?
            </h3>
            <p style={{ margin: "0", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              Update <strong>{confirmRole.user.name}</strong> from{" "}
              <strong>{roleDisplay[confirmRole.user.role]}</strong> to{" "}
              <strong>{roleDisplay[confirmRole.newRole]}</strong>?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setConfirmRole(null)}
                style={{
                  padding: "9px 20px",
                  border: "1.5px solid rgba(30,58,95,0.12)",
                  background: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#4a5568",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                style={{
                  padding: "9px 20px",
                  border: "none",
                  background: NAVY,
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(30,58,95,0.25)",
                }}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(239,68,68,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 6px", color: NAVY, fontWeight: 800, fontSize: "17px" }}>
              Delete User?
            </h3>
            <p style={{ margin: "0", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              This will permanently delete <strong>{confirmDelete.name}</strong> and all associated appointments. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: "9px 20px",
                  border: "1.5px solid rgba(30,58,95,0.12)",
                  background: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#4a5568",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                style={{
                  padding: "9px 20px",
                  border: "none",
                  background: RED,
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
