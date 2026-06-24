import { useState } from "react";

const NAVY   = "#1E3A5F";
const GREEN  = "#22c55e";
const GOLD   = "#F5C518";

export default function Settings({ isMobile }) {
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

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

<div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>System Settings</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Configure clinic profile, security preferences, and integration settings
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", lg: "2fr 1fr", gap: "24px" }} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">

<div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 14px rgba(30,58,95,0.07)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: NAVY }}>Clinic Information Profile</h3>
          
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Clinic Name</label>
                <input 
                  type="text" 
                  value={clinicName} 
                  onChange={e => setClinicName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Support Email</label>
                <input 
                  type="email" 
                  value={clinicEmail} 
                  onChange={e => setClinicEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Contact Number</label>
                <input 
                  type="text" 
                  value={clinicPhone} 
                  onChange={e => setClinicPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#4a5568" }}>Physical Address</label>
                <input 
                  type="text" 
                  value={clinicAddress} 
                  onChange={e => setClinicAddress(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(30,58,95,0.12)", outline: "none", fontSize: "13px", boxSizing: "border-box" }}
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

<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

<div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 14px rgba(30,58,95,0.07)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: NAVY }}>System Preferences</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "smsAlerts", label: "Patient SMS reminders", desc: "Automated SMS booking notices" },
                { key: "emailAlerts", label: "Email reports summaries", desc: "Daily system operations digest" },
                { key: "twoFactor", label: "Two-Factor Auth (2FA)", desc: "Enforce extra login protection" },
                { key: "devMode", label: "System developer mode", desc: "Show detailed system debugger logs" }
              ].map(t => (
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

<div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 14px rgba(30,58,95,0.07)", display: "flex", flexDirection: "column", gap: "8px" }}>
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
