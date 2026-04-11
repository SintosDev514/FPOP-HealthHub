import { useState } from "react";

export default function NavBar({ setScreen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[72px] flex items-center justify-between">
          
          <div className="flex items-center gap-1">
            <img
              src="/FPOPLOGO1.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-600">
              FPOP Clinic Portal
            </h2>
          </div>

          {/* DESKTOP NAV */}
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
  );
}