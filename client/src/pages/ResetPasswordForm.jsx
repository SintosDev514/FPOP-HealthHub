import { useState } from "react";
import logo from "../assets/logo.png";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin h-5 w-5"
  >
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

export default function ResetPasswordForm({
  email,
  onBackToLogin,
  onComplete,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (error) setError("");
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedArray = pastedData.split("");

    if (
      pastedArray.length === 6 &&
      pastedArray.every((char) => /^\d$/.test(char))
    ) {
      setOtp(pastedArray);
      // Focus last input after paste
      const lastInput = document.getElementById(`otp-input-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    console.log("Resending OTP to:", email);

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
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onComplete();
      console.log("Password reset successfully for:", email);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
      <button
        onClick={onBackToLogin}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        ← Back to Login
      </button>

      <div className="text-center mb-8">
        {}
        <img
          src={logo}
          alt="FPOP Clinic Portal Logo"
          className="w-16 h-16 rounded-2xl object-cover mb-5 mx-auto shadow-sm"
        />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm">
          Enter the OTP sent to your email and create a new password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-100 px-4 flex items-center text-slate-700">
            {email}
          </div>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 6-Digit OTP
          </label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={index === 0 ? handleOtpPaste : undefined}
                className={`w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-semibold rounded-xl border ${
                  error ? "border-red-300" : "border-slate-200"
                } bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
            ))}
          </div>
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              className={`text-sm ${
                resendCooldown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors`}
            >
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
            </button>
          </div>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {}
        {error && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 rounded-xl p-3">
            <AlertCircleIcon />
            {error}
          </div>
        )}

        {}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Password requirements:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
              {newPassword.length >= 8 ? <CheckCircleIcon /> : "○"} At least 8
              characters long
            </li>
            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
              {/[A-Z]/.test(newPassword) ? <CheckCircleIcon /> : "○"} At least
              one uppercase letter (A-Z)
            </li>
            <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
              {/[a-z]/.test(newPassword) ? <CheckCircleIcon /> : "○"} At least
              one lowercase letter (a-z)
            </li>
            <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
              {/[0-9]/.test(newPassword) ? <CheckCircleIcon /> : "○"} At least
              one number (0-9)
            </li>
          </ul>
        </div>

        {}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon />
              Resetting Password...
            </>
          ) : (
            "Reset Password →"
          )}
        </button>
      </form>
    </div>
  );
}
