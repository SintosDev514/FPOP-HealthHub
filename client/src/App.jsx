import { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

import "react-toastify/dist/ReactToastify.css";

function LoginForm({ onOpenSignup, onOpenForgotPassword }) {
  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-5"></div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          FPOP Clinic Portal
        </h2>
        <p className="mt-3 text-slate-500 text-lg">
          Welcome back! Please login to continue
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-slate-800 font-semibold mb-3">
            Email Address
          </label>
          <input
            type="email"
            placeholder="alvarezdareen776@gmail.com"
            className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-800 font-semibold mb-3">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm md:text-base">
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </button>
        </div>

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
            onClick={onOpenSignup}
            className="text-blue-600 font-semibold"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

function SignupForm({ onOpenLogin }) {
  return (
    <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4"></div>

        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="mt-2 text-slate-500">
          Join FPOP Clinic for better healthcare
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-slate-800 font-semibold mb-2">
            I am a
          </label>
          <button
            type="button"
            className="w-full rounded-xl border-2 border-blue-600 text-blue-600 font-semibold py-3 bg-blue-50"
          >
            Patient
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-800 font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-800 font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="FPOPClinicPortal@gmail.com"
            className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-800 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" className="mt-1" />
          <span>
            I agree to the{" "}
            <a href="#" className="text-blue-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <p className="text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-blue-600 font-semibold"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [resetEmail, setResetEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleResetPassword = (email) => {
    setResetEmail(email);
    setScreen("reset");
  };

  const handleComplete = () => {
    setScreen("success");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {screen === "landing" && (
        <>
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-1">
                  <img
                    src="public/FPOPLOGO1.png"
                    alt="Logo"
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-slate-600">
                    FPOP Clinic Portal
                  </h2>
                </div>

                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                  <button className="text-slate-600 hover:text-blue-600 font-medium">
                    Contact
                  </button>
                  <button className="text-slate-600 hover:text-blue-600 font-medium">
                    About Us
                  </button>
                  <button className="text-slate-600 hover:text-blue-600 font-medium">
                    Location
                  </button>
                </nav>

                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={() => setScreen("login")}
                    className="h-10 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setScreen("signup")}
                    className="h-10 px-5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
                  >
                    Sign Up
                  </button>
                </div>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 text-slate-700"
                >
                  <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
                </button>
              </div>

              {/* MOBILE MENU */}
              {menuOpen && (
                <div className="md:hidden pb-4">
                  <nav className="flex flex-col gap-3 pt-2">
                    <button className="text-left text-slate-600 hover:text-blue-600 font-medium">
                      Contact
                    </button>
                    <button className="text-left text-slate-600 hover:text-blue-600 font-medium">
                      About Us
                    </button>
                    <button className="text-left text-slate-600 hover:text-blue-600 font-medium">
                      Location
                    </button>

                    <div className="flex flex-col gap-3 pt-3">
                      <button
                        onClick={() => {
                          setScreen("login");
                          setMenuOpen(false);
                        }}
                        className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setScreen("signup");
                          setMenuOpen(false);
                        }}
                        className="h-11 px-5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
                      >
                        Sign Up
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </header>

          <section className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
              
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium mb-6">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center"></div>
                  <span>FPOP Clinic Portal</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Better healthcare starts with a simpler patient portal.
                </h1>

                <p className="mt-5 text-lg text-slate-600 max-w-xl leading-8">
                  Manage appointments, access your records, and stay connected
                  with your clinic in one secure place.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setScreen("login")}
                    className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setScreen("signup")}
                    className="h-14 px-8 rounded-2xl border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] shadow-md p-6 md:p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                    <p className="text-sm text-slate-500">Appointments</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                      24/7
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Book anytime
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                    <p className="text-sm text-slate-500">Patient Access</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                      Secure
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Safe & private
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-600 p-5 text-white col-span-2">
                    <p className="text-sm text-blue-100">Portal Experience</p>
                    <h3 className="text-3xl font-bold mt-2">
                      Fast & Simple
                    </h3>
                    <p className="text-sm text-blue-100 mt-3">
                      Clean and easy workflow for patients and staff.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {screen === "login" && (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <button
              onClick={() => setScreen("landing")}
              className="mb-4 text-sm text-slate-600 hover:text-slate-900"
            >
              ← Home
            </button>
            <LoginForm
              onOpenSignup={() => setScreen("signup")}
              onOpenForgotPassword={() => setScreen("forgotpassword")}
            />
          </div>
        </section>
      )}

      {screen === "signup" && (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-xl">
            <button
              onClick={() => setScreen("landing")}
              className="mb-4 text-sm text-slate-600 hover:text-slate-900"
            >
              ← Home
            </button>
            <SignupForm onOpenLogin={() => setScreen("login")} />
          </div>
        </section>
      )}

      {screen === "forgotpassword" && (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <ForgotPasswordForm
              onBackToLogin={() => setScreen("login")}
              onResetPassword={handleResetPassword}
            />
          </div>
        </section>
      )}

      {screen === "reset" && (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <ResetPasswordForm
              email={resetEmail}
              onBackToLogin={() => setScreen("login")}
              onComplete={handleComplete}
            />
          </div>
        </section>
      )}

      {screen === "success" && (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <SuccessMessage onBackToLogin={() => setScreen("login")} />
          </div>
        </section>
      )}
    </div>
  );
}