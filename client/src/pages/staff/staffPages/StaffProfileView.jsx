import React, { useState } from "react";

const StaffProfileView = ({ profile, onSaveProfile, onBackToDashboard }) => {
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
  };

  const subtleShadow = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
      <div className="mb-8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-sm font-medium mb-4"
          style={{ color: '#1E3A5F' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={subtleShadow}>
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Update your staff information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#F5C518] rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 transition-transform"
                onClick={() => {
                  const url = prompt("Enter image URL for your profile picture:", formData.avatar || "https://i.pravatar.cc/150?u=staff");
                  if (url) setFormData({ ...formData, avatar: url });
                }}
              >
                <svg className="w-4 h-4 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">Click icon to change picture</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName || formData.name?.split(' ')[0] || ''}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || formData.name?.split(' ')[1] || ''}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="ICU">ICU</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <select
                  value={formData.position || ''}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Position</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Technician">Technician</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Specialist">Specialist</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License/ID Number</label>
              <input
                type="text"
                value={formData.licenseId || ''}
                onChange={e => setFormData({ ...formData, licenseId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., Cardiothoracic Surgery"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                rows="4"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default StaffProfileView;
