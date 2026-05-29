import React, { useState } from "react";

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

const getProfileAppointmentStats = (profileData = {}) => {
  const stats = profileData.appointmentStats || {};
  return {
    total: stats.total ?? profileData.totalAppointments ?? 0,
    upcoming: stats.upcoming ?? profileData.upcomingAppointments ?? 0,
    completed: stats.completed ?? profileData.completedAppointments ?? 0,
    pending: stats.pending ?? profileData.pendingAppointments ?? 0,
  };
};

const getInitialProfileData = (profile) => ({
  name: "",
  email: "",
  phone: "",
  location: "",
  dateOfBirth: "1990-05-15",
  ...profile,
});

const ProfileView = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState(() => getInitialProfileData(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const visibleProfile = isEditing ? formData : getInitialProfileData(profile);
  const appointmentStats = getProfileAppointmentStats(visibleProfile);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarChange = () => {
    if (!isEditing) return;
    const url = prompt(
      "Enter image URL for your profile picture:",
      visibleProfile.avatar || "https://i.pravatar.cc/150?u=sarah"
    );
    if (url) setFormData((current) => ({ ...current, avatar: url }));
  };

  const handleCancel = () => {
    setFormData(getInitialProfileData(profile));
    setIsEditing(false);
  };

  return (
    <main className="flex-1 bg-[#f7f8fa] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1110px]">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#061022]">Profile</h1>
          <p className="mt-3 text-base text-[#18304d]">
            Manage your personal information and preferences
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[348px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[12px] border border-slate-200 bg-white p-8 text-center shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
              <button
                type="button"
                onClick={handleAvatarChange}
                className={`group relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-[24px] bg-[#244783] text-white shadow-[0_10px_22px_rgba(15,23,42,0.2)] ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label="Change profile picture"
              >
                {visibleProfile.avatar ? (
                  <img src={visibleProfile.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Icon type="user" className="h-16 w-16" />
                )}
                {isEditing && (
                  <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#244783] opacity-0 shadow-sm transition group-hover:opacity-100">
                    <Icon type="camera" className="h-4 w-4" />
                  </span>
                )}
              </button>
              <h2 className="mt-12 text-2xl font-bold text-[#061022]">{visibleProfile.name || "Sarah Johnson"}</h2>
              <p className="mt-8 text-sm text-[#18304d]">{visibleProfile.email || "sarah.j@email.com"}</p>
              <div className="my-10 h-px bg-slate-200" />
              <p className="text-sm text-[#18304d]">
                Member since <strong className="font-bold text-[#061022]">Jan 2026</strong>
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
                value={visibleProfile.location}
                placeholder="123 Healthcare Ave, Medical City, MC 12345"
                onChange={(value) => updateField("location", value)}
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
                <p className="mt-2 text-sm text-[#18304d]">Mock support details for this preview.</p>
              </div>
              <button type="button" className="text-slate-500" onClick={() => setSupportOpen(false)}>
                x
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="font-bold text-[#061022]">Email</p>
                <p className="mt-1 text-[#18304d]">support@fpopclinic.local</p>
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
