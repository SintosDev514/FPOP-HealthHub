import { useState } from "react";

/* ─── FPOP Brand Tokens ─────────────────────────────────────── */
const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const PURPLE = "#7c3aed";

const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function UserManagement({ isMobile }) {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15", avatarBg: PURPLE },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Staff", status: "Active", joinDate: "2024-02-20", avatarBg: "#3b82f6" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Active", joinDate: "2024-03-10", avatarBg: "#6366f1" },
    { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "User", status: "Suspended", joinDate: "2024-01-25", avatarBg: "#ec4899" },
    { id: 5, name: "David Brown", email: "david@example.com", role: "Staff", status: "Active", joinDate: "2024-04-12", avatarBg: "#06b6d4" },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("User");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newId = users.length + 1;
    const colors = [PURPLE, "#3b82f6", "#6366f1", "#ec4899", "#06b6d4"];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];
    
    const newUser = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      avatarBg: randomBg
    };

    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("User");
    setShowAddModal(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Active" ? "Suspended" : "Active" };
      }
      return u;
    }));
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>User Management</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
            Manage and monitor all system users
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#3b82f6",
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
            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
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
            placeholder="Search users by name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 16px 9px 38px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", fontSize: "13px", color: "#333", outline: "none", background: "#f7fafc", fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="User">User</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "13px", color: "#4a5568", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {isMobile ? (
        /* ── Mobile: card list ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredUsers.length > 0 ? filteredUsers.map(user => (
            <div key={user.id} style={{ background: "#fff", borderRadius: "14px", padding: "16px", boxShadow: "0 2px 10px rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: user.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                  <div style={{ fontSize: "12px", color: "#718096", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: user.role === "Admin" ? "rgba(124,58,237,0.1)" : user.role === "Staff" ? "rgba(59,130,246,0.1)" : "rgba(107,114,128,0.1)", color: user.role === "Admin" ? PURPLE : user.role === "Staff" ? "#3b82f6" : "#6b7280" }}>{user.role}</span>
                  <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: user.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: user.status === "Active" ? GREEN : RED }}>{user.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid rgba(30,58,95,0.06)" }}>
                <span style={{ fontSize: "11px", color: "#a0aec0" }}>Joined {user.joinDate}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button title="Edit" style={{ background: "transparent", border: "none", color: "#3b82f6", cursor: "pointer", padding: "4px", display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button onClick={() => toggleStatus(user.id)} title={user.status === "Active" ? "Suspend" : "Unsuspend"} style={{ background: "transparent", border: "none", color: user.status === "Active" ? "#ea580c" : GREEN, cursor: "pointer", padding: "4px", display: "flex" }}>
                    {user.status === "Active" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} title="Delete" style={{ background: "transparent", border: "none", color: RED, cursor: "pointer", padding: "4px", display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: "center", padding: "30px", color: "#8a96a3", background: "#fff", borderRadius: "14px" }}>No users match the criteria.</div>
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
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: "1px solid rgba(30,58,95,0.04)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: user.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px" }}>
                          {user.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: NAVY }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 24px", color: "#4a5568" }}>{user.email}</td>
                    <td style={{ padding: "14px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: user.role === "Admin" ? "rgba(124,58,237,0.1)" : user.role === "Staff" ? "rgba(59,130,246,0.1)" : "rgba(107,114,128,0.1)", color: user.role === "Admin" ? PURPLE : user.role === "Staff" ? "#3b82f6" : "#6b7280" }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: user.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: user.status === "Active" ? GREEN : RED }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 24px", color: "#718096" }}>{user.joinDate}</td>
                    <td style={{ padding: "14px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button title="Edit" style={{ background: "transparent", border: "none", color: "#3b82f6", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button onClick={() => toggleStatus(user.id)} title={user.status === "Active" ? "Suspend" : "Unsuspend"} style={{ background: "transparent", border: "none", color: user.status === "Active" ? "#ea580c" : GREEN, cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
                          {user.status === "Active" ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} title="Delete" style={{ background: "transparent", border: "none", color: RED, cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "30px", color: "#8a96a3", textAlign: "center" }}>No users match the criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 20px", color: NAVY, fontWeight: 800, fontSize: "18px" }}>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>System Role</label>
                <select 
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box", background: "#fff" }}
                >
                  <option value="User">User</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4a5568" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: "8px 20px", border: "none", background: "#3b82f6", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.2)" }}
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
