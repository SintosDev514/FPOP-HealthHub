import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { EyeIcon, EyeOffIcon } from "../components/icon/EyeIcons";
import { useAuth } from "../context/AuthContext";
import ReCaptcha from "./ReCaptcha";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);
  const canSubmit = email && password && recaptchaToken;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          recaptchaToken,
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
        setError(data.message);
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again ");
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative overflow-hidden bg-[#F9FAFB]">
      {/* Soft floating background gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none -z-10 [animation-delay:2s]" />

      <div className="w-full max-w-md bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_20px_42px_rgba(30,58,95,0.06)] rounded-[1.5rem] p-4 md:p-5 z-10">
        <div className="flex flex-col items-center text-center mb-3">
          <img
            src={logo}
            alt="FPOP Clinic Portal Logo"
            className="w-22 h-22"
          />

          <h2 className="text-xl md:text-2xl font-bold text-[#1E3A5F] tracking-tight">
            FPOP Clinic Portal
          </h2>
          <p className="mt-0.5 text-slate-500 text-xs">
            Welcome back! Please login to continue
          </p>
        </div>

        <form className="space-y-2.5" onSubmit={handleLogin}>
          <div>
            <label className="block text-[#1E3A5F] font-bold text-xs tracking-wide uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="FPOPHealthHub@gmail.com"
              required
              className="w-full h-9 rounded-lg border border-slate-200 bg-white/60 px-3 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[#1E3A5F] font-bold text-xs tracking-wide uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-9 rounded-lg border border-slate-200 bg-white/60 px-3 pr-9 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300 text-sm text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs">
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
              className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="p-2.5 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
              {message}
            </div>
          )}

          <ReCaptcha ref={recaptchaRef} onChange={setRecaptchaToken} />

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full h-10 rounded-full font-bold text-sm border-2 border-transparent transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(30,58,95,0.15)] ${
              canSubmit
                ? "bg-[#1E3A5F] text-white hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none transform-none"
            }`}
          >
            Sign In
          </button>

          <p className="text-center text-slate-500 text-xs font-medium">
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
  );
}
export default LoginForm;
