import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

/* ICONS */
const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SpinnerIcon = () => (
  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
);

export default function ResetPasswordForm({ onComplete }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const canSubmit =
    otp.join("").length === 6 &&
    newPassword &&
    confirmPassword &&
    !isLoading;

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  /* Protect route */
  useEffect(() => {
    if (!email) navigate("/forgotpass");
  }, [email, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) return "Minimum 8 characters";
    if (!/[A-Z]/.test(password)) return "Add uppercase letter";
    if (!/[a-z]/.test(password)) return "Add lowercase letter";
    if (!/[0-9]/.test(password)) return "Add a number";
    return null;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);

    try {
      await fetch(`${__API_BASE__}/api/auth/sendResetOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setError("Failed to resend OTP");
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) return setError("Enter 6-digit OTP");

    const passError = validatePassword(newPassword);
    if (passError) return setError(passError);

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${__API_BASE__}/api/auth/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newPassword,
          OTP: otpValue,
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("resetEmail");
        onComplete?.();
        navigate("/login");
      } else {
        setError(data.message || "Reset failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* Left Panel - Form */}
      <div className="relative lg:w-1/2 min-h-[calc(100vh-56px)] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/3 -left-20 w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl opacity-80 pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 -right-20 w-[350px] h-[350px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_20px_42px_rgba(30,58,95,0.06)] rounded-[2rem] p-5 md:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#1E3A5F] tracking-tight">
                Reset Password
              </h2>
              <p className="mt-0.5 text-slate-500 text-xs break-all">
                {email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* OTP */}
              <div>
                <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1 text-center">
                  Enter OTP
                </label>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-9 h-10 text-center text-sm font-bold rounded-xl border border-slate-200 bg-white/60 focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 outline-none transition-all duration-300 text-[#1E3A5F]"
                    />
                  ))}
                </div>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0}
                    className={`text-[10px] font-bold transition-colors duration-300 ${
                      resendCooldown > 0
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-[#1E3A5F] hover:text-[#F5C518]"
                    }`}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="************"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 pr-10 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="************"
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

              {/* ERROR */}
              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full h-10 rounded-xl font-bold text-xs border-2 border-transparent transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(30,58,95,0.15)] ${
                  canSubmit
                    ? "bg-[#1E3A5F] text-white hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none transform-none"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon /> Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              <p className="text-center text-slate-500 text-[10px] font-medium">
                Remember your password?{" "}
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
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-2xl flex items-center justify-center mb-4 ring-2 ring-[#F5C518]/30 backdrop-blur-sm">
            <img
              src={logo}
              alt="FPOP Clinic"
              className="w-14 h-14 lg:w-16 lg:h-16"
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
                  <svg
                    className="w-2.5 h-2.5 text-[#F5C518]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/80 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
