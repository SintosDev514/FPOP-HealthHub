import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

    try {
      const res = await fetch(`${__API_BASE__}/api/auth/sendResetOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetEmail", email);
        navigate("/resetpass");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 lg:p-12 relative overflow-hidden bg-[#F9FAFB]">
      {/* Soft floating background gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#F5C518]/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none -z-10 [animation-delay:2s]" />

      <div className="w-full max-w-md bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_20px_42px_rgba(30,58,95,0.06)] rounded-[2rem] p-5 md:p-6 z-10">
        <div className="text-center flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="FPOP Clinic Portal Logo"
            className="w-14 h-14 rounded-full object-cover mb-3 shadow-md border-2 border-white"
          />

          <h2 className="text-xl font-bold text-[#1E3A5F] tracking-tight">
            Forgot Password?
          </h2>

          <p className="mt-1 text-slate-500 text-xs">
            Enter your email address and we'll send you an OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[#1E3A5F] font-semibold text-[10px] tracking-wide uppercase mb-1">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`w-full h-9 rounded-xl border ${
                error ? "border-red-300 focus:ring-red-500/10" : "border-slate-200 focus:border-[#F5C518] focus:ring-[#F5C518]/10"
              } bg-white/60 px-3 text-xs text-slate-700 outline-none focus:ring-4 transition-all duration-300`}
              placeholder="your.email@example.com"
            />

            {error && (
              <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl bg-[#1E3A5F] text-white font-bold text-xs border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F] shadow-[0_8px_20px_rgba(30,58,95,0.15)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Sending OTP...
              </>
            ) : (
              "Send OTP â†’"
            )}
          </button>

          <p className="text-center text-slate-500 text-[10px] font-medium pt-1">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#1E3A5F] hover:text-[#F5C518] font-bold transition-colors duration-300 flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>â†</span> Back to Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
