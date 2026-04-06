// ResetPasswordForm.jsx
import { useState } from "react";
import MessageIcon from "./MessageIcon";

export default function ResetPasswordForm({ email, onBackToLogin, onComplete }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    if (error) setError("");
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedArray = pastedData.split("");
    
    if (pastedArray.length === 6 && pastedArray.every(char => /^\d$/.test(char))) {
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
    
    // Countdown timer
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

    // Simulate API call to verify OTP and reset password
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
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-5 mx-auto">
          <MessageIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600 text-sm">
          Enter the OTP sent to your email and create a new password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-100 px-4 flex items-center text-slate-700">
            {email}
          </div>
        </div>

        {/* OTP Input */}
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

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 rounded-xl p-3">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {/* Password Requirements */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
              {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters long
            </li>
            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
              {/[A-Z]/.test(newPassword) ? "✓" : "○"} At least one uppercase letter (A-Z)
            </li>
            <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
              {/[a-z]/.test(newPassword) ? "✓" : "○"} At least one lowercase letter (a-z)
            </li>
            <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
              {/[0-9]/.test(newPassword) ? "✓" : "○"} At least one number (0-9)
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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