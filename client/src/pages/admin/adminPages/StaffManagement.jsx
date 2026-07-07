import { useState, useEffect } from "react";

const NAVY = "#1E3A5F";
const GREEN = "#22c55e";
const RED = "#ef4444";
const GOLD = "#F5C518";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const emptySchedule = () => ({
  "0": { active: false, start: "08:00", end: "17:00" },
  "1": { active: true, start: "08:00", end: "17:00" },
  "2": { active: true, start: "08:00", end: "17:00" },
  "3": { active: true, start: "08:00", end: "17:00" },
  "4": { active: true, start: "08:00", end: "17:00" },
  "5": { active: true, start: "08:00", end: "17:00" },
  "6": { active: false, start: "08:00", end: "17:00" },
});

export default function StaffManagement({ isMobile }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);
  const [editSchedule, setEditSchedule] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.users.filter((u) => u.role === "staff"));
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newStaffEmail || !newStaffPassword) return;
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
          email: newStaffEmail,
          password: newStaffPassword,
          role: "staff",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStaff((prev) => [data.user, ...prev]);
        setNewFirstName("");
        setNewLastName("");
        setNewStaffEmail("");
        setNewStaffPassword("");
        setShowAddModal(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to create staff");
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = staff.filter((s) => {
    const name = (s.name || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const activeDaysCount = (schedule) => {
    if (!schedule) return 0;
    return Object.values(schedule).filter((d) => d?.active).length;
  };

  const openEditor = (member) => {
    const base = member.schedule || {};
    const filled = {};
    for (let i = 0; i < 7; i++) {
      const key = String(i);
      filled[key] = {
        active: base[key]?.active ?? (i >= 1 && i <= 5),
        start: base[key]?.start || "08:00",
        end: base[key]?.end || "17:00",
      };
    }
    setEditingStaff(member);
    setEditSchedule(filled);
  };

  const toggleDay = (key) => {
    setEditSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };

  const updateTime = (key, field, value) => {
    setEditSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const saveSchedule = async () => {
    if (!editingStaff) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `${__API_BASE__}/api/admin/users/${editingStaff._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedule: editSchedule }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        setError(`Server error: ${res.status}${text ? " - " + text.slice(0, 100) : ""}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStaff((prev) =>
          prev.map((s) =>
            s._id === editingStaff._id ? { ...s, schedule: editSchedule } : s
          )
        );
        setEditingStaff(null);
        setEditSchedule(null);
      } else {
        setError(data.message || "Failed to save schedule");
      }
    } catch (err) {
      setError("Failed to save schedule: " + (err.message || "network error"));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (member) => {
    setConfirmRemove(member);
  };

  const confirmRemoveStaff = async () => {
    if (!confirmRemove) return;
    const member = confirmRemove;
    setConfirmRemove(null);
    try {
      const res = await fetch(
        `${__API_BASE__}/api/admin/users/${member._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "patient" }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setStaff((prev) => prev.filter((s) => s._id !== member._id));
      } else {
        setError(data.message || "Failed to remove staff");
      }
    } catch (err) {
      setError("Failed to remove staff: " + (err.message || "network error"));
    }
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
            Staff Management
          </h1>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13px",
              color: "#8a96a3",
              fontWeight: 500,
            }}
          >
            Manage staff schedules and assignments
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
          Add Staff
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.2)",
            color: RED,
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid rgba(30,58,95,0.07)",
          boxShadow: "0 2px 14px rgba(30,58,95,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(30,58,95,0.07)",
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
              placeholder="Search staff by name or email..."
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
          <span
            style={{
              fontSize: "13px",
              color: "#8a96a3",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {staff.length} staff member{staff.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#8a96a3",
            }}
          >
            Loading staff...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#8a96a3",
            }}
          >
            {search ? "No staff match your search." : "No staff members found."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid rgba(30,58,95,0.07)",
                  }}
                >
                  <th
                    style={{
                      padding: "14px 24px",
                      color: "#4a5568",
                      fontWeight: 600,
                    }}
                  >
                    Staff
                  </th>
                  <th
                    style={{
                      padding: "14px 24px",
                      color: "#4a5568",
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "14px 24px",
                      color: "#4a5568",
                      fontWeight: 600,
                    }}
                  >
                    Schedule
                  </th>
                  <th
                    style={{
                      padding: "14px 24px",
                      color: "#4a5568",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr
                    key={member._id}
                    style={{
                      borderBottom: "1px solid rgba(30,58,95,0.06)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafbfc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 24px",
                        fontWeight: 600,
                        color: "#2d3748",
                      }}
                    >
                      {member.name}
                    </td>
                    <td
                      style={{
                        padding: "14px 24px",
                        color: "#5a6475",
                      }}
                    >
                      {member.email}
                    </td>
                    <td
                      style={{
                        padding: "14px 24px",
                        color: "#5a6475",
                      }}
                    >
                      {activeDaysCount(member.schedule) > 0 ? (
                        <span
                          style={{
                            background: "rgba(34,197,94,0.1)",
                            color: GREEN,
                            padding: "2px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {activeDaysCount(member.schedule)} active day
                          {activeDaysCount(member.schedule) !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            color: RED,
                            padding: "2px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          Not set
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 24px",
                        textAlign: "right",
                      }}
                    >
                      <button
                        onClick={() => openEditor(member)}
                        style={{
                          border: "none",
                          background: NAVY,
                          color: "#fff",
                          padding: "7px 14px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => handleRemove(member)}
                        style={{
                          border: "none",
                          background: "rgba(239,68,68,0.1)",
                          color: RED,
                          padding: "7px 14px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Editor Modal */}
      {editingStaff && editSchedule && (
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
              maxWidth: "560px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: NAVY,
                  fontWeight: 800,
                  fontSize: "17px",
                }}
              >
                {editingStaff.name} â€” Schedule
              </h3>
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setEditSchedule(null);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: "4px",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const key = String(i);
                const day = editSchedule[key];
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: day.active
                        ? "rgba(34,197,94,0.06)"
                        : "#f8fafc",
                      border: `1.5px solid ${day.active ? "rgba(34,197,94,0.2)" : "rgba(30,58,95,0.08)"}`,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        minWidth: "60px",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: NAVY,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={day.active}
                        onChange={() => toggleDay(key)}
                        style={{ accentColor: NAVY }}
                      />
                      {DAY_LABELS[i]}
                    </label>

                    {day.active && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) =>
                            updateTime(key, "start", e.target.value)
                          }
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            border: "1.5px solid rgba(30,58,95,0.12)",
                            fontSize: "12px",
                            color: "#333",
                            outline: "none",
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          to
                        </span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) =>
                            updateTime(key, "end", e.target.value)
                          }
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            border: "1.5px solid rgba(30,58,95,0.12)",
                            fontSize: "12px",
                            color: "#333",
                            outline: "none",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setEditSchedule(null);
                }}
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
                onClick={saveSchedule}
                disabled={saving}
                style={{
                  padding: "9px 20px",
                  border: "none",
                  background: saving ? "#94a3b8" : NAVY,
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: `0 4px 12px ${NAVY}40`,
                }}
              >
                {saving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {confirmRemove && (
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
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={RED}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3
              style={{
                margin: "0 0 6px",
                color: NAVY,
                fontWeight: 800,
                fontSize: "17px",
              }}
            >
              Remove Staff?
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              This will change <strong>{confirmRemove.name}</strong>'s role to{" "}
              <strong>User (patient)</strong>. Their appointments will be
              preserved but they will lose staff access.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setConfirmRemove(null)}
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
                onClick={confirmRemoveStaff}
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
                Remove
              </button>
            </div>
          </div>
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
            <h3
              style={{
                margin: "0 0 20px",
                color: NAVY,
                fontWeight: 800,
                fontSize: "18px",
              }}
            >
              Add New Staff
            </h3>
            <form onSubmit={handleAddStaff}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    fontSize: "13px",
                    color: "#333",
                    outline: "none",
                    fontFamily: "'Poppins',sans-serif",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(30,58,95,0.12)",
                    fontSize: "13px",
                    color: "#333",
                    outline: "none",
                    fontFamily: "'Poppins',sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid rgba(30,58,95,0.12)",
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  marginBottom: "16px",
                  fontFamily: "'Poppins',sans-serif",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newStaffPassword}
                onChange={(e) => setNewStaffPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid rgba(30,58,95,0.12)",
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  marginBottom: "12px",
                  fontFamily: "'Poppins',sans-serif",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: "#8a96a3",
                  marginBottom: "20px",
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "8px",
                }}
              >
                Role: <strong style={{ color: NAVY }}>Staff</strong>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFirstName("");
                    setNewLastName("");
                    setNewStaffEmail("");
                    setNewStaffPassword("");
                  }}
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
                    background: saving ? "#94a3b8" : NAVY,
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: `0 4px 12px ${NAVY}40`,
                  }}
                >
                  {saving ? "Saving..." : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
