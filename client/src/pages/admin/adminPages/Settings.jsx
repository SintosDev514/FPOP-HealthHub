import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/useAuth";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const GOLD   = "#F5C518";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1.5px solid rgba(30,58,95,0.12)",
  outline: "none",
  fontSize: "13px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#4a5568",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(30,58,95,0.07)",
  boxShadow: "0 2px 14px rgba(30,58,95,0.07)",
};

export default function Settings({ isMobile }) {
  const { user, updateProfile } = useAuth();

  const [clinicName, setClinicName] = useState("FPOP Family Planning Clinic");
  const [clinicEmail, setClinicEmail] = useState("info@fpop-clinic.org");
  const [clinicPhone, setClinicPhone] = useState("+63 2 8123 4567");
  const [clinicAddress, setClinicAddress] = useState("123 Brand Street, Manila, Philippines");

  const [toggles, setToggles] = useState({
    smsAlerts: true,
    emailAlerts: true,
    twoFactor: false,
    devMode: false
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ── Admin profile state ── */
  const [profileLoading, setProfileLoading] = useState(true);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${__API_BASE__}/api/user/data`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const u = data.userData;
          setFirstName(u.firstName || "");
          setLastName(u.lastName || "");
          setEmail(u.email || "");
          setAvatar(u.avatar || "");
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const showProfileMsg = (type, text) => {
    setProfileMsg({ type, text });
    setTimeout(() => setProfileMsg(null), 4000);
  };

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showProfileMsg("error", "First name is required");
      return;
    }

    setSavingProfile(true);
    try {
      const body = new FormData();
      body.append("name", `${firstName.trim()} ${lastName.trim()}`.trim());
      if (avatarFile) body.append("avatar", avatarFile);

      const res = await fetch(`${__API_BASE__}/api/user/update`, {
        method: "PUT",
        credentials: "include",
        body,
      });
      const data = await res.json();
      if (data.success) {
        const u = data.userData || {};
        const nextFirstName = u.firstName || firstName.trim();
        const nextLastName = u.lastName || lastName.trim();
        setFirstName(nextFirstName);
        setLastName(nextLastName);
        setAvatar(u.avatar || "");
        setAvatarFile(null);
        setAvatarPreview(null);
        updateProfile({
          firstName: nextFirstName,
          lastName: nextLastName,
          avatar: u.avatar || "",
        });
        showProfileMsg("success", "Admin profile updated successfully!");
      } else {
        showProfileMsg("error", data.message || "Failed to update profile");
      }
    } catch {
      showProfileMsg("error", "Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>System Settings</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Configure clinic profile, security preferences, and integration settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]" style={{ gap: "24px" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ════ Admin Profile ════ */}
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Admin Profile</h3>

            <form onSubmit={handleProfileSave}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, #13253E, #2A5488)`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: 800,
                    flexShrink: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Change profile picture"
                >
                  {avatarPreview || avatar ? (
                    <img
                      src={avatarPreview || avatar}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    (firstName || "A").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: NAVY }}>
                    {(firstName || lastName ? `${firstName} ${lastName}`.trim() : email || "Admin")}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8a96a3" }}>Administrator</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginTop: "10px",
                      background: "#eef2f6",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: NAVY,
                      cursor: "pointer",
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={inputStyle}
                    disabled={profileLoading}
                    placeholder="Admin first name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={inputStyle}
                    disabled={profileLoading}
                    placeholder="Admin last name"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ ...inputStyle, background: "#f8fafc", color: "#8a96a3", cursor: "not-allowed" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={savingProfile || profileLoading}
                  style={{
                    background: NAVY,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(30,58,95,0.2)",
                    opacity: savingProfile || profileLoading ? 0.6 : 1,
                  }}
                >
                  {savingProfile ? "Saving..." : "Update Profile"}
                </button>
                {profileMsg && (
                  <span style={{
                    color: profileMsg.type === "success" ? GREEN : "#dc2626",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    {profileMsg.type === "success" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    )}
                    {profileMsg.text}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* ════ Clinic Information ════ */}
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Clinic Information Profile</h3>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Clinic Name</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Support Email</label>
                  <input
                    type="email"
                    value={clinicEmail}
                    onChange={(e) => setClinicEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input
                    type="text"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Physical Address</label>
                  <input
                    type="text"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "24px" }}>
                <button
                  type="submit"
                  style={{ background: NAVY, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(30,58,95,0.2)" }}
                >
                  Save Changes
                </button>
                {saveSuccess && (
                  <span style={{ color: GREEN, fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    Settings updated successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: NAVY }}>System Preferences</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "smsAlerts", label: "Patient SMS reminders", desc: "Automated SMS booking notices" },
                { key: "emailAlerts", label: "Email reports summaries", desc: "Daily system operations digest" },
                { key: "twoFactor", label: "Two-Factor Auth (2FA)", desc: "Enforce extra login protection" },
                { key: "devMode", label: "System developer mode", desc: "Show detailed system debugger logs" }
              ].map((t) => (
                <div key={t.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: NAVY, display: "block" }}>{t.label}</span>
                    <span style={{ fontSize: "11px", color: "#8a96a3" }}>{t.desc}</span>
                  </div>
                  <button
                    onClick={() => handleToggle(t.key)}
                    style={{
                      width: "38px",
                      height: "20px",
                      borderRadius: "99px",
                      background: toggles[t.key] ? GREEN : "rgba(30,58,95,0.14)",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s"
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "#fff",
                      top: "3px",
                      left: toggles[t.key] ? "21px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#8a96a3", textTransform: "uppercase", letterSpacing: "0.5px" }}>Database Status</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: NAVY }}>FPOP_HealthHub_Prod</span>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4a5568", borderTop: "1px solid rgba(30,58,95,0.08)", paddingTop: "8px", marginTop: "4px" }}>
              <span>Auto Backup:</span>
              <span style={{ fontWeight: 700 }}>Daily 02:00 AM</span>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
