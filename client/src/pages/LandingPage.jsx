import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image - mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/portrait-logo-mobile-view.jfif)" }}
      />

      {/* Background image - desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url(/fpopbg1.jpg)" }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f33]/95 via-[#1a314d]/85 to-[#1a314d]/70" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f1f33] to-transparent" />

      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 relative z-10 pt-8 lg:pt-12 pb-20 lg:pb-28 text-center">
        {/* Location tag */}
        <div className="inline-flex items-center justify-center gap-1.5 text-amber-400/70 text-[10px] tracking-[0.15em] uppercase mb-5">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Calbayog City, Philippines
        </div>

        {/* Decorative divider */}
        <div className="w-12 h-0.5 bg-amber-400/50 rounded-full mb-6 mx-auto" />

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.15] tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-400">
            Community Health Care Center
          </span>
        </h1>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
          Empowering you to take control of your health. Book appointments, view records, and communicate with your doctor — all from the comfort of your home.
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="h-10 px-7 bg-amber-400 text-[#0f1f33] font-semibold rounded-lg text-xs
              hover:bg-amber-300 active:scale-[0.97]
              transition-all duration-200 ease-out
              shadow-[0_4px_16px_rgba(245,197,24,0.3)]
              hover:shadow-[0_6px_24px_rgba(245,197,24,0.45)]"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/services")}
            className="h-10 px-7 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg text-xs
              border border-white/25 hover:bg-white/20
              active:scale-[0.97] transition-all duration-200 ease-out"
          >
            Our Services
          </button>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
