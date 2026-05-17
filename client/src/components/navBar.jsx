import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-md
        bg-[#1E3A5F]/95
        border-b border-[#F5C518]/20
        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px]">
          
          {/* LOGO & TITLE */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#F5C518]/20 rounded-full blur-md group-hover:bg-[#F5C518]/30 transition-all duration-300"></div>
              <img
                src="/FPOPLOGO1.png"
                alt="Logo"
                className="relative w-14 h-14 object-contain transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-md sm:text-lg font-bold text-white tracking-wide group-hover:text-[#F5C518] transition-colors duration-300">
                FPOP Clinic Portal
              </h2>
              <span className="text-[10px] text-[#F5C518]/80 uppercase tracking-widest -mt-1 font-semibold">
                Healthcare Hub
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-[#1E3A5F]/50 border border-[#F5C518]/20 rounded-full py-1.5 px-2 backdrop-blur-md">
            {[
              { name: "Contact", path: "/contact" },
              { name: "About Us", path: "/about" },
              { name: "Location", path: "/location" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="
                  px-5 py-1.5 rounded-full
                  text-sm font-semibold text-white/90
                  transition-all duration-300
                  hover:text-[#F5C518] hover:bg-white/5
                "
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="
                h-10 px-5 rounded-full
                border border-[#F5C518]/40 hover:border-[#F5C518]
                bg-[#1E3A5F] hover:bg-white
                text-sm font-semibold text-white hover:text-[#1E3A5F]
                transition-all duration-300
              "
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="
                h-10 px-6 rounded-full
                bg-[#F5C518] text-[#1E3A5F]
                text-sm font-bold border border-[#F5C518]
                shadow-[0_4px_14px_rgba(245,197,24,0.2)]
                hover:bg-white hover:text-[#1E3A5F]
                transform hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              Sign Up
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#F5C518]/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>

        {/* MOBILE DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#F5C518]/10">
            <nav className="flex flex-col gap-2">
              {[
                { name: "Contact", path: "/contact" },
                { name: "About Us", path: "/about" },
                { name: "Location", path: "/location" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left font-semibold text-white/80 hover:text-[#F5C518] hover:bg-white/5 transition-all duration-300"
                >
                  {item.name}
                </button>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-[#F5C518]/10 pt-4 px-2">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="
                    h-11 w-full rounded-full
                    border border-[#F5C518]/40 hover:border-[#F5C518]
                    bg-[#1E3A5F] hover:bg-white
                    text-sm font-semibold text-white hover:text-[#1E3A5F]
                    transition-all duration-300
                  "
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  className="
                    h-11 w-full rounded-full
                    bg-[#F5C518] text-[#1E3A5F]
                    text-sm font-bold border border-[#F5C518]
                    hover:bg-white hover:text-[#1E3A5F]
                    shadow-[0_4px_14px_rgba(245,197,24,0.2)]
                    transition-all duration-300
                  "
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