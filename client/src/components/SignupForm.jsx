import { useState } from "react";
import logo from "../assets/logo.png";
import { EyeIcon, EyeOffIcon } from "../components/icon/EyeIcons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [agreed, setAgreed] = useState(false);
  const canSubmit =
    firstName &&
    lastName &&
    email &&
    password &&
    confirmPassword &&
    agreed;

  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setMessage("");
      return;
    }

    try {
      const res = await fetch(`${__API_BASE__}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          dateOfBirth,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setError("");
        await checkAuth();
        const role = (data.user?.role || "").toLowerCase();

        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "staff") navigate("/staff", { replace: true });
        else navigate("/home", { replace: true });
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch {
      setError("Signup failed. Please try again.");
      setMessage("");
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] flex flex-col lg:flex-row bg-[#F9FAFB]">
        {/* Left Panel - Form */}
        <div className="relative lg:w-1/2 min-h-[calc(100vh-56px)] overflow-y-auto flex items-start lg:items-center justify-center p-4 lg:p-12">
          {/* Background blobs */}
          <div className="fixed top-1/3 -left-20 w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl opacity-80 pointer-events-none -z-10" />
          <div className="fixed bottom-1/3 -right-20 w-[350px] h-[350px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

          <div className="w-full max-w-md py-8 lg:py-0">
            <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_20px_42px_rgba(30,58,95,0.06)] rounded-[2rem] p-5 md:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#1E3A5F] tracking-tight">
                  Create Account
                </h2>
                <p className="mt-0.5 text-slate-500 text-xs">
                  Join FPOP Clinic for better healthcare
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleSignup}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder=""
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 pr-10 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder=""
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 pr-10 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[10px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]/20 cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="leading-tight text-slate-500 font-medium">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => openModal("terms")}
                      className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300 underline underline-offset-2"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => openModal("privacy")}
                      className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300 underline underline-offset-2"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>

                {error && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs font-medium">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full h-10 rounded-xl font-bold text-xs border-2 border-transparent transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(30,58,95,0.15)] ${
                    canSubmit
                      ? "bg-[#1E3A5F] text-white hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] cursor-pointer"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none transform-none"
                  }`}
                >
                  Create Account
                </button>

                <p className="text-center text-slate-500 text-[10px] font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300 underline underline-offset-4"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right Panel - Branding */}
        <div className="relative lg:w-1/2 min-h-[40vh] lg:min-h-[calc(100vh-56px)] bg-[#1E3A5F] overflow-hidden flex items-center justify-center p-8 lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-[#152a47]" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#F5C518]/10 hidden lg:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#F5C518]/15 hidden lg:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#F5C518]/20 hidden lg:block" />

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F5C518]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#F5C518]/40 rounded-full hidden lg:block" />
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#F5C518]/30 rounded-full hidden lg:block" />
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full hidden lg:block" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            <div className="mb-3 flex items-center justify-center rounded-2xl border border-[#F5C518]/60 bg-[#1E3A5F] p-2 shadow-sm">
              <img 
              src="/logoo.png" 
              alt="FPOP Clinic" 
              className="h-14 w-14 object-contain sm:h-20 sm:w-20" 
              />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">
              FPOP Clinic Portal
            </h1>
            <p className="text-[#F5C518] text-xs lg:text-sm font-medium mb-6 lg:mb-8">
              Your Health, Our Priority
            </p>

            <div className="space-y-3 text-left hidden lg:block">
              {[
                "Secure & Confidential Access",
                "Easy Appointment Management",
                "24/7 Portal Availability",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#F5C518]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#F5C518]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-xs">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E3A5F]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/40 p-8 relative flex flex-col max-h-[85vh]">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">
              {modalType === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              Please read the following information carefully before continuing.
            </p>

            <div className="text-sm text-slate-600 space-y-4 overflow-y-auto pr-2 leading-relaxed border rounded-2xl p-5 bg-slate-50 flex-1">
              {modalType === "terms" ? (
                <>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      1. Acceptance of Terms
                    </h3>
                    <p>
                      By creating an account and using the FPOP Clinic Portal,
                      you agree to comply with these Terms of Service. If you do
                      not agree with any part of these terms, you should not use
                      the portal.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      2. Use of the Portal
                    </h3>
                    <p>
                      The portal is intended to help patients access
                      healthcare-related services such as account registration,
                      appointment scheduling, and viewing clinic-related
                      information. You agree to use the system only for lawful
                      and appropriate purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      3. Account Responsibility
                    </h3>
                    <p>
                      You are responsible for keeping your login credentials
                      confidential. Any activity that happens under your account
                      is your responsibility. You must provide accurate,
                      complete, and updated information when creating your
                      account.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      4. Prohibited Activities
                    </h3>
                    <p>
                      Users must not misuse the portal, attempt unauthorized
                      access, submit false medical or personal information,
                      interfere with system operations, or use the platform in a
                      way that may harm the clinic or other users.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      5. Appointments and Services
                    </h3>
                    <p>
                      Appointment requests made through the portal remain
                      subject to clinic approval, availability of doctors or
                      staff, and applicable clinic policies. The clinic reserves
                      the right to reschedule, confirm, or cancel appointments
                      when necessary.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      6. Limitation of Liability
                    </h3>
                    <p>
                      The clinic will make reasonable efforts to maintain the
                      availability and accuracy of the portal, but does not
                      guarantee uninterrupted or error-free access at all times.
                      Temporary downtime may occur during maintenance, updates,
                      or technical issues.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      7. Termination of Access
                    </h3>
                    <p>
                      The clinic may suspend or terminate access to the portal
                      if a user violates these terms, provides false
                      information, or engages in actions that compromise the
                      safety, integrity, or security of the system.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      8. Changes to Terms
                    </h3>
                    <p>
                      These Terms of Service may be updated from time to time.
                      Continued use of the portal after changes are posted means
                      that you accept the revised terms.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      1. Information We Collect
                    </h3>
                    <p>
                      The FPOP Clinic Portal may collect personal information
                      such as your first name, last name, email address, login
                      credentials, and other details necessary for account
                      registration, appointment handling, and clinic
                      communication.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      2. Purpose of Collection
                    </h3>
                    <p>
                      Your information is collected to provide
                      healthcare-related portal services, verify your identity,
                      manage appointments, improve user experience, and maintain
                      proper clinic records where applicable.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      3. Use of Personal Data
                    </h3>
                    <p>
                      Personal data will only be used for legitimate clinic
                      operations and patient support purposes. Your information
                      will not be used in ways unrelated to portal services
                      without appropriate notice or consent, unless required by
                      law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      4. Data Protection
                    </h3>
                    <p>
                      The clinic takes reasonable administrative and technical
                      measures to help protect personal information against
                      unauthorized access, loss, misuse, or disclosure. However,
                      no digital system can guarantee absolute security.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      5. Data Sharing
                    </h3>
                    <p>
                      Personal information will not be sold or unnecessarily
                      shared with third parties. Data may only be shared when
                      needed for clinic operations, legal compliance, protection
                      of patient safety, or other lawful purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      6. Data Retention
                    </h3>
                    <p>
                      Information may be retained for as long as necessary to
                      support clinic services, comply with applicable policies,
                      resolve disputes, or meet legal and administrative
                      obligations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      7. User Rights
                    </h3>
                    <p>
                      You may request to review or update certain personal
                      information you submitted through the portal, subject to
                      clinic rules and applicable legal requirements. Accurate
                      records help ensure better service and communication.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      8. Updates to this Policy
                    </h3>
                    <p>
                      This Privacy Policy may be revised from time to time to
                      reflect changes in clinic practices, legal requirements,
                      or system updates. Continued use of the portal means you
                      acknowledge the latest version of the policy.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-bold hover:bg-white hover:border-[#F5C518] border-2 border-transparent hover:text-[#1E3A5F] transition-all duration-300 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignupForm;
