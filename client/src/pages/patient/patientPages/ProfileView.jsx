import React, { useState, useRef } from "react";

const Icon = ({ type, className = "h-5 w-5" }) => {
  const paths = {
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    phone:
      "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    location:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    edit:
      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    camera:
      "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z",
    save: "M5 13l4 4L19 7",
    arrowLeft: "M15 18l-6-6 6-6",
    close: "M6 18L18 6M6 6l12 12",
    status: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  );
};

const ProfileField = ({ disabled, icon, label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="mb-3 block text-sm font-bold text-[#061022]">{label}</label>
    <div className={`flex h-12 items-center gap-4 rounded-[8px] px-4 text-sm text-slate-400 ${
      disabled ? "bg-slate-50/70" : "bg-slate-50 ring-1 ring-[#244783]/10"
    }`}>
      <Icon type={icon} className="h-5 w-5 shrink-0 text-slate-300" />
      <input
        disabled={disabled}
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent font-medium text-[#061022] outline-none placeholder:text-slate-400 disabled:cursor-default disabled:text-slate-500"
      />
    </div>
  </div>
);

const MobileProfileRow = ({ icon, label, value, editing, inputValue, onChange, placeholder, type = "text" }) => (
  <div className="flex min-h-[57px] items-center gap-3 border-b border-slate-100 px-4 last:border-b-0">
    <Icon type={icon} className="h-4 w-4 shrink-0 text-slate-600" />
    <div className="min-w-0 flex-1">
      <p className="text-[11px] leading-tight text-slate-500">{label}</p>
      {editing && onChange ? (
        <input
          type={type}
          value={inputValue || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-0.5 w-full border-b border-slate-200 bg-transparent pb-0.5 text-xs text-[#172033] outline-none placeholder:text-slate-400"
        />
      ) : (
        <p className="mt-0.5 truncate text-xs text-[#4b5563]">{value}</p>
      )}
    </div>
  </div>
);

const MobileProfileAppointment = ({ appointment }) => {
  const date = appointment.date ? new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date to be confirmed";
  const status = appointment.status || "upcoming";

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#172033]">{appointment.serviceName || "Clinic appointment"}</p>
          <p className="mt-1 text-xs text-slate-500">{date}{appointment.time ? ` · ${appointment.time}` : ""}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${status === "pending" ? "bg-amber-50 text-amber-700" : status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#244783]"}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-slate-50 text-[#061022]",
    blue: "border border-blue-200 bg-blue-50 text-blue-700",
    green: "border border-green-200 bg-green-50 text-green-700",
    orange: "border border-amber-200 bg-amber-50 text-[#c45b00]",
  };

  return (
    <div className={`flex items-center justify-between rounded-[8px] px-3 py-4 text-sm font-bold ${tones[tone]}`}>
      <span>{label}</span>
      <strong className="text-2xl">{value}</strong>
    </div>
  );
};

const getAppointmentStats = (appointmentList = []) =>
  appointmentList.reduce(
    (stats, a) => {
      const s = a.status || "upcoming";
      return {
        ...stats,
        total: stats.total + 1,
        upcoming: stats.upcoming + (s === "upcoming" ? 1 : 0),
        completed: stats.completed + (s === "completed" ? 1 : 0),
        pending: stats.pending + (s === "pending" ? 1 : 0),
      };
    },
    { total: 0, upcoming: 0, completed: 0, pending: 0 }
  );

const getInitialProfileData = (profile) => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  ...profile,
});

const formatMemberSince = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const ProfileView = ({ profile, onSaveProfile, appointments = [], onBackToDashboard }) => {
  const [formData, setFormData] = useState(() => getInitialProfileData(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [mobileTab, setMobileTab] = useState("personal");
  const fileInputRef = useRef(null);
  const visibleProfile = isEditing ? { ...formData, avatar: avatarPreview || formData.avatar } : getInitialProfileData(profile);
  const appointmentStats = getAppointmentStats(appointments);

  const handleSubmit = (event) => {
    event?.preventDefault();
    onSaveProfile({ ...formData, avatarFile: formData.avatarFile || null });
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleMobileAvatarClick = () => {
    if (!isEditing) {
      setFormData(getInitialProfileData(profile));
      setIsEditing(true);
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((current) => ({ ...current, avatarFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData(getInitialProfileData(profile));
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const [avatarError, setAvatarError] = useState(false);
  const avatarSrc = avatarPreview || (visibleProfile.avatar || null);

  return (
    <main className="flex-1 bg-[#f7f8fa] px-0 py-0 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1110px]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <section className="min-h-[calc(100dvh-44px)] bg-white sm:hidden">
          <header className="flex h-12 items-center justify-between border-b border-slate-100 px-3">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-600"
              aria-label="Back to dashboard"
            >
              <Icon type="arrowLeft" className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold text-[#172033]">My Profile</h1>
            {isEditing ? (
              <button type="button" onClick={handleSubmit} className="text-sm font-semibold text-[#244783]">Save</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData(getInitialProfileData(profile));
                  setIsEditing(true);
                }}
                className="text-sm font-semibold text-[#244783]"
              >
                Edit
              </button>
            )}
          </header>

          <div className="px-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#dce3e9] text-[#244783]">
                  {avatarSrc && !avatarError ? (
                    <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" onError={() => setAvatarError(true)} />
                  ) : (
                    <Icon type="user" className="h-8 w-8" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleMobileAvatarClick}
                  className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#244783] shadow-sm"
                  aria-label="Change profile picture"
                >
                  <Icon type="camera" className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      value={formData.name || ""}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="w-full border-b border-slate-300 bg-transparent text-sm font-bold text-[#172033] outline-none"
                      placeholder="Your name"
                    />
                  ) : (
                  <h2 className="truncate text-base font-bold text-[#172033]">{visibleProfile.name || "Your Name"}</h2>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon type="status" className={`h-3.5 w-3.5 ${profile?.isAccountVerified ? "text-[#244783]" : "text-slate-400"}`} />
                  <span>{profile?.isAccountVerified ? "Account active" : "Account pending"}</span>
                 
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-md bg-[#e8eaee] p-0.5 text-[11px] font-medium">
              <button type="button" onClick={() => setMobileTab("personal")} className={`rounded-[4px] px-3 py-1.5 text-center ${mobileTab === "personal" ? "bg-white text-[#172033] shadow-sm" : "text-slate-600"}`}>Personal Info</button>
              <button type="button" onClick={() => setMobileTab("appointments")} className={`rounded-[4px] px-3 py-1.5 text-center ${mobileTab === "appointments" ? "bg-white text-[#172033] shadow-sm" : "text-slate-600"}`}>Appointments</button>
            </div>
          </div>

          {mobileTab === "personal" ? (
            <div className="mt-3 border-y border-slate-100">
              <MobileProfileRow icon="mail" label="Email" value={visibleProfile.email || "Add an email address"} editing={isEditing} inputValue={formData.email} onChange={(value) => updateField("email", value)} placeholder="Add an email address" type="email" />
              <MobileProfileRow icon="phone" label="Phone" value={visibleProfile.phone || "Add a phone number"} editing={isEditing} inputValue={formData.phone} onChange={(value) => updateField("phone", value)} placeholder="Add a phone number" />
              <MobileProfileRow icon="calendar" label="Date of birth" value={visibleProfile.dateOfBirth || "Add your date of birth"} editing={isEditing} inputValue={formData.dateOfBirth} onChange={(value) => updateField("dateOfBirth", value)} placeholder="Add your date of birth" type="date" />
              <MobileProfileRow icon="location" label="Location" value={visibleProfile.address || "Add a location"} editing={isEditing} inputValue={formData.address} onChange={(value) => updateField("address", value)} placeholder="Add a location" />
            </div>
          ) : (
            <div className="mt-3 space-y-2 bg-slate-50 px-4 py-3">
              {appointments.length ? appointments.map((appointment) => <MobileProfileAppointment key={appointment._id || appointment.id} appointment={appointment} />) : <p className="py-8 text-center text-sm text-slate-500">No appointments yet.</p>}
            </div>
          )}

          {isEditing && (
            <button type="button" onClick={handleCancel} className="mx-4 mt-5 text-xs font-medium text-slate-500">
              Cancel editing
            </button>
          )}
        </section>

        <header className="mb-10 hidden sm:block">
          <h1 className="text-4xl font-bold text-[#061022]">Profile</h1>
          <p className="mt-3 text-base text-[#18304d]">
            Manage your personal information and preferences
          </p>
        </header>

        <form onSubmit={handleSubmit} className="hidden grid-cols-1 gap-8 sm:grid lg:grid-cols-[348px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[12px] border border-slate-200 bg-white p-8 text-center shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
              <button
                type="button"
                onClick={handleAvatarClick}
                className={`group relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#244783] text-white shadow-[0_10px_22px_rgba(15,23,42,0.2)] ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label="Change profile picture"
              >
                {avatarSrc && !avatarError ? (
                  <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" onError={() => setAvatarError(true)} />
                ) : (
                  <Icon type="user" className="h-16 w-16" />
                )}
                {isEditing && (
                  <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#244783] opacity-0 shadow-sm transition group-hover:opacity-100">
                    <Icon type="camera" className="h-4 w-4" />
                  </span>
                )}
              </button>
              <h2 className="mt-12 text-2xl font-bold text-[#061022]">{visibleProfile.name || "Your Name"}</h2>
              <p className="mt-8 text-sm text-[#18304d]">{visibleProfile.email || "your@email.com"}</p>
              <div className="my-10 h-px bg-slate-200" />
              <p className="text-sm text-[#18304d]">
                Member since <strong className="font-bold text-[#061022]">{formatMemberSince(profile?.memberSince)}</strong>
              </p>
            </section>

            <section className="rounded-[12px] border border-slate-200 bg-white p-6 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
              <h2 className="text-lg font-bold text-[#061022]">Appointment Statistics</h2>
              <div className="mt-12 space-y-4">
                <StatRow label="Total" value={appointmentStats.total} />
                <StatRow label="Upcoming" value={appointmentStats.upcoming} tone="blue" />
                <StatRow label="Completed" value={appointmentStats.completed} tone="green" />
                <StatRow label="Pending" value={appointmentStats.pending} tone="orange" />
              </div>
            </section>

            <section className="rounded-[12px] bg-[#244783] p-6 text-white shadow-[0_3px_10px_rgba(15,23,42,0.16)]">
              <h2 className="text-lg font-bold">Need Help?</h2>
              <p className="mt-10 text-sm leading-6 text-white">
                Contact our support team for assistance with your account
              </p>
              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                className="mt-12 h-11 w-full rounded-[8px] bg-white/90 text-sm font-bold text-[#061022] transition hover:bg-white"
              >
                Contact Support
              </button>
            </section>
          </aside>

          <section className="rounded-[12px] border border-slate-200 bg-white p-8 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#061022]">Personal Information</h2>
                <p className="mt-1 text-sm text-[#18304d]">Update your personal details</p>
              </div>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-[8px] border border-slate-200 px-5 py-3 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-3 rounded-[8px] bg-[#244783] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1c396f]"
                  >
                    <Icon type="save" className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(getInitialProfileData(profile));
                    setIsEditing(true);
                  }}
                  className="flex items-center justify-center gap-3 rounded-[8px] border border-slate-200 px-5 py-3 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
                >
                  <Icon type="edit" className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-8">
              <ProfileField
                disabled={!isEditing}
                label="Full Name"
                icon="user"
                value={visibleProfile.name}
                placeholder="Sarah Johnson"
                onChange={(value) => updateField("name", value)}
              />
              <ProfileField
                disabled={!isEditing}
                label="Email Address"
                icon="mail"
                type="email"
                value={visibleProfile.email}
                placeholder="sarah.j@email.com"
                onChange={(value) => updateField("email", value)}
              />
              <ProfileField
                disabled={!isEditing}
                label="Phone Number"
                icon="phone"
                type="tel"
                value={visibleProfile.phone}
                placeholder="+1 (555) 123-4567"
                onChange={(value) => updateField("phone", value)}
              />
              <ProfileField
                disabled={!isEditing}
                label="Address"
                icon="location"
                value={visibleProfile.address}
                placeholder="123 Healthcare Ave, Medical City, MC 12345"
                onChange={(value) => updateField("address", value)}
              />
              <ProfileField
                disabled={!isEditing}
                label="Date of Birth"
                icon="calendar"
                type="date"
                value={visibleProfile.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />
            </div>
          </section>
        </form>
      </div>
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#061022]">Contact Support</h2>
                <p className="mt-2 text-sm text-[#18304d]">Reach out to us for assistance</p>
              </div>
              <button type="button" className="text-slate-500" onClick={() => setSupportOpen(false)}>
                x
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="font-bold text-[#061022]">Email</p>
                <p className="mt-1 text-[#18304d]">support@fpopclinic.com</p>
              </div>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="font-bold text-[#061022]">Phone</p>
                <p className="mt-1 text-[#18304d]">(555) 123-4567</p>
              </div>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="font-bold text-[#061022]">Hours</p>
                <p className="mt-1 text-[#18304d]">Monday to Friday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfileView;
