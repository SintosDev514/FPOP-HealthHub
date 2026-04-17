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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");


  const [agreed, setAgreed] = useState(false);

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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setError("");
        await checkAuth();
        navigate("/home");
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch  {
      setError("Signup failed. Please try again.");
      setMessage("");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-md p-10 md:p-8">
          <div className="w-full max-w-xl p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src={logo}
                alt="FPOP Clinic Portal Logo"
                className="w-14 h-14 rounded-4xl object-cover mb-4 shadow-sm"
              />

              <h2 className="text-2xl font-bold text-slate-900">
                Create Account
              </h2>
              <p className="mt-2 text-slate-500">
                Join FPOP Clinic for better healthcare
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="block text-slate-800 font-semibold mb-2">
                  I am a
                </label>
                <button
                  type="button"
                  className="w-full rounded-xl border-2 border-blue-600 text-blue-600 font-semibold py-3 bg-blue-50"
                >
                  Patient
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="FPOPClinicPortal@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => openModal("terms")}
                    className="text-blue-600 underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => openModal("privacy")}
                    className="text-blue-600 underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-700 text-sm">
                  {message}
                </div>
              )}

        
              <button
                type="submit"
                disabled={!agreed}
                className={`w-full h-12 rounded-xl text-white font-semibold transition ${
                  agreed
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                Create Account
              </button>

              <p className="text-center text-slate-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

    
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative">
            {/* NEW CODE: close button sa taas */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 text-xl hover:text-gray-700"
            >
              ×
            </button>

  
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {modalType === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h2>

  
            <p className="text-sm text-slate-500 mb-4">
              Please read the following information carefully before continuing.
            </p>

      
            <div className="text-sm text-slate-600 space-y-4 max-h-80 overflow-y-auto pr-2 leading-relaxed border rounded-xl p-4 bg-slate-50">
              {modalType === "terms" ? (
                <>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
                      5. Appointments and Services
                    </h3>
                    <p>
                      Appointment requests made through the portal remain subject
                      to clinic approval, availability of doctors or staff, and
                      applicable clinic policies. The clinic reserves the right
                      to reschedule, confirm, or cancel appointments when
                      necessary.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
                      2. Purpose of Collection
                    </h3>
                    <p>
                      Your information is collected to provide healthcare-related
                      portal services, verify your identity, manage
                      appointments, improve user experience, and maintain proper
                      clinic records where applicable.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                    <h3 className="font-semibold text-slate-800 mb-1">
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
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
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