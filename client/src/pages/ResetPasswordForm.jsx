import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

/* ICONS */
const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-5 h-5"
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
    className="w-5 h-5"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SpinnerIcon = () => (
  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
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
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative overflow-hidden bg-[#F9FAFB]">
      {/* Soft floating background gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none -z-10 [animation-delay:2s]" />

      <div className="w-full max-w-lg bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_24px_50px_rgba(30,58,95,0.06)] rounded-[2.5rem] p-8 md:p-10 z-10">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 mx-auto mb-4 rounded-full object-cover shadow-md border-2 border-white"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] tracking-tight">Reset Password</h2>
          <p className="mt-2.5 text-slate-500 text-base break-all font-semibold">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP */}
          <div>
            <label className="block text-[#1E3A5F] font-bold text-sm tracking-wide uppercase mb-3 text-center">
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
                  className="w-12 h-14 text-center text-xl font-bold rounded-2xl border border-slate-200 bg-white/60 focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 outline-none transition-all duration-300 text-[#1E3A5F]"
                />
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className={`text-sm font-bold transition-colors duration-300 ${
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
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white/60 px-5 pr-12 text-slate-700 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
            >
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white/60 px-5 pr-12 text-slate-700 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-14 rounded-full bg-[#1E3A5F] text-white font-bold text-lg border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] shadow-[0_8px_20px_rgba(30,58,95,0.15)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:bg-[#1E3A5F] disabled:hover:border-transparent disabled:hover:text-white disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <SpinnerIcon /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
