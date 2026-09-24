import { useState, useEffect } from "react";

const NAVY = "#1E3A5F";
const RED = "#ef4444";

const CATEGORY_LABELS = {
  "family-planning": "Family Planning & Contraceptives",
  "sti-hiv": "STI & HIV-AIDS",
  asrh: "ASRH",
};

const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function Services({ isMobile }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "family-planning" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/services`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: "", category: "family-planning" });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditing(service);
    setForm({ name: service.name, category: service.category });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const isEdit = Boolean(editing);
      const res = await fetch(
        isEdit
          ? `${__API_BASE__}/api/admin/services/${editing._id}`
          : `${__API_BASE__}/api/admin/services`,
        {
          method: isEdit ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, category: form.category }),
        }
      );
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setServices((prev) => prev.map((s) => (s._id === data.service._id ? data.service : s)));
        } else {
          setServices((prev) => [data.service, ...prev]);
        }
        setShowModal(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (service) => {
    setConfirmDelete(service);
  };

  const confirmDeleteService = async () => {
    if (!confirmDelete) return;
    const service = confirmDelete;
    setConfirmDelete(null);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/services/${service._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== service._id));
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete service");
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
          <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>
            Services
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
            Manage the services shown in appointment booking and on the public site
          </p>
        </div>
        <button
          onClick={openAddModal}
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
          <IcoPlus />
          Add Service
        </button>
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
            borderRadius: "16px",
            border: "1px solid rgba(30,58,95,0.07)",
            padding: "40px",
            textAlign: "center",
            color: "#8a96a3",
          }}
        >
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(30,58,95,0.07)",
            padding: "40px",
            textAlign: "center",
            color: "#8a96a3",
          }}
        >
          No services yet. Click "Add Service" to create one.
        </div>
      ) : isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {services.map((service) => (
            <div
              key={service._id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "16px",
                boxShadow: "0 2px 10px rgba(30,58,95,0.07)",
                border: "1px solid rgba(30,58,95,0.07)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "14px" }}>{service.name}</div>
                  <div style={{ fontSize: "12px", color: "#718096", marginTop: "2px" }}>
                    {CATEGORY_LABELS[service.category] || service.category}
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(service)}
                  title="Edit"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(service)}
                  title="Delete"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: RED,
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    flexShrink: 0,
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
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 14px rgba(30,58,95,0.07)",
            border: "1px solid rgba(30,58,95,0.07)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid rgba(30,58,95,0.07)" }}>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Service</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "16px 24px", color: "#4a5568", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service._id}
                  style={{ borderBottom: "1px solid rgba(30,58,95,0.04)", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 24px", fontWeight: 700, color: NAVY }}>{service.name}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: "#f1f4f8",
                        color: NAVY,
                      }}
                    >
                      {CATEGORY_LABELS[service.category] || service.category}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => openEditModal(service)}
                        title="Edit"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#3b82f6",
                          cursor: "pointer",
                          padding: "4px",
                          display: "inline-flex",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        title="Delete"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: RED,
                          cursor: "pointer",
                          padding: "4px",
                          display: "inline-flex",
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
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
              maxWidth: "440px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 20px", color: NAVY, fontWeight: 800, fontSize: "18px" }}>
              {editing ? "Edit Service" : "Add New Service"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Condom"
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
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                  <option value="family-planning">Family Planning & Contraceptives</option>
                  <option value="sti-hiv">STI & HIV-AIDS</option>
                  <option value="asrh">Adolescent Sexual Reproductive Health (ASRH)</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                    background: saving ? "#94a3bd" : NAVY,
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(30,58,95,0.25)",
                  }}
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Save Service"}
                </button>
              </div>
            </form>
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
              Delete Service?
            </h3>
            <p style={{ margin: "0", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              This will permanently remove <strong>{confirmDelete.name}</strong> from the booking list and public site. Existing appointment records will not be affected.
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
                onClick={confirmDeleteService}
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