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
      const res = await fetch("http://localhost:5000/api/auth/sendResetOtp", {
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-lg bg-white  rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
        <div className="text-center flex flex-col items-center   mb-8">
          <img
            src={logo}
            alt="FPOP Clinic Portal Logo"
            className="w-16 h-16 rounded-4xl object-cover mb-5 shadow-sm"
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>

          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you an OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`w-full h-14 rounded-2xl border ${
                error ? "border-red-300" : "border-slate-200"
              } bg-slate-50 px-4 outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="your.email@example.com"
            />

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm mt-1">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                Sending OTP...
              </>
            ) : (
              "Send OTP →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
