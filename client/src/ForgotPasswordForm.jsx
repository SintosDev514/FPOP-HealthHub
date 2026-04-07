// ForgotPasswordForm.jsx
import { useState } from "react";
import logo from "./assets/logo.png"; // Import the logo from assets folder

export default function ForgotPasswordForm({ onBackToLogin, onResetPassword }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      // Directly go to reset password page after sending OTP
      onResetPassword(email);
      console.log("Sending OTP to:", email);
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
        {/* Logo PNG instead of MessageIcon */}
        <img 
          src={logo} 
          alt="FPOP Clinic Portal Logo" 
          className="w-16 h-16 rounded-2xl object-cover mb-5 mx-auto shadow-sm"
        />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600 text-sm">
          Enter your email address and we'll send you an OTP
          <br />
          to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className={`w-full h-14 rounded-2xl border ${
              error ? "border-red-300" : "border-slate-200"
            } bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="your.email@example.com"
          />
          {error && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Sending OTP...
            </>
          ) : (
            "Send OTP →"
          )}
        </button>
      </form>
    </div>
  );
}