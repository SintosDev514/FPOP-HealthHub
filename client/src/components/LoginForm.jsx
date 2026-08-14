import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { EyeIcon, EyeOffIcon } from "../components/icon/EyeIcons";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../apiBase";
import Loader from "../components/Loader";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [rememberMe, setRememberMe] = useState("");
  const canSubmit = email && password;

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        await checkAuth();

        const role = (data.user?.role || "").toLowerCase();

        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "staff") navigate("/staff", { replace: true });
        else navigate("/home", { replace: true });
      } else {
        setIsLoggingIn(false);
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setIsLoggingIn(false);
      setError("Something went wrong. Please try again ");
    }
  };

  if (isLoggingIn) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* Left Panel - Form */}
      <div className="relative lg:w-1/2 min-h-[calc(100vh-56px)] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/3 -left-20 w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl opacity-80 pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 -right-20 w-[350px] h-[350px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_20px_42px_rgba(30,58,95,0.06)] rounded-[2rem] p-5 md:p-6">
            <div className="mb-5 flex flex-col items-center text-center">
              <div className="mb-3 flex items-center justify-center rounded-2xl border border-[#F5C518]/30 bg-[#1E3A5F] p-1 shadow-sm">
                <img
                  src="/logoo.png"
                  alt="FPOP Clinic Portal"
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1E3A5F] sm:text-[2rem]">
                Welcome Back
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleLogin}>
              <div>
                <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="FPOPHealthHub@gmail.com"
                  required
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="************"
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

              <div className="flex items-center justify-between gap-4 text-[10px]">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]/20 cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgotpass")}
                  className="text-[#1E3A5F] hover:text-[#F5C518] font-semibold transition-colors duration-300"
                >
                  Forgot Password?
                </button>
              </div>

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
                Sign In
              </button>

              <p className="text-center text-slate-500 text-[10px] font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300 underline underline-offset-4"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="relative lg:w-1/2 min-h-[40vh] lg:min-h-[calc(100vh-56px)] bg-[#1E3A5F] overflow-hidden flex items-center justify-center p-8 lg:p-12">
        <div className="absolute inset-0 bg-[#1E3A5F]" />

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
export default LoginForm;
