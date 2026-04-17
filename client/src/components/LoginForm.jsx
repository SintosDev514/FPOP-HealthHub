import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { EyeIcon, EyeOffIcon } from "../components/icon/EyeIcons";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState("");

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
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        await checkAuth();
        navigate("/home");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-none px-4">
      <div className="w-full max-w-lg   p-6 md:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            {}
            <img
              src={logo}
              alt="FPOP Clinic Portal Logo"
              className="w-16 h-16 rounded-4xl object-cover mb-5 shadow-sm"
            />

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              FPOP Clinic Portal
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              Welcome back! Please login to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-slate-800 font-semibold mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="FPOPHealthHub@gmail.com"
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm md:text-base">
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgotpass")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

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
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            <p className="text-center text-slate-600 text-base">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-600 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;
