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
        navigate("/staff");
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

      <div className="w-full max-w-lg bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_24px_50px_rgba(30,58,95,0.06)] rounded-[2.5rem] p-8 md:p-10 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={logo}
            alt="FPOP Clinic Portal Logo"
            className="w-16 h-16 rounded-full object-cover mb-4 shadow-md border-2 border-white"
          />

          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] tracking-tight">
            FPOP Clinic Portal
          </h2>
          <p className="mt-2.5 text-slate-500 text-base">
            Welcome back! Please login to continue
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[#1E3A5F] font-bold text-sm tracking-wide uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="FPOPHealthHub@gmail.com"
              required
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white/60 px-5 text-slate-700 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-[#1E3A5F] font-bold text-sm tracking-wide uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-14 rounded-2xl border border-slate-200 bg-white/60 px-5 pr-12 text-slate-700 outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/10 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#1E3A5F] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm md:text-base">
            <label className="flex items-center gap-2.5 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]/20 cursor-pointer"
              />
              <span className="font-medium text-sm">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgotpass")}
              className="text-sm text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
              {message}
            </div>
          )}

          <ReCaptcha ref={recaptchaRef} onChange={setRecaptchaToken} />

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-14 rounded-full bg-[#1E3A5F] text-white font-bold text-lg border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] shadow-[0_8px_20px_rgba(30,58,95,0.15)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:bg-[#1E3A5F] disabled:hover:border-transparent disabled:hover:text-white disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            Sign In
          </button>

          <p className="text-center text-slate-500 text-sm font-medium pt-2">
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
