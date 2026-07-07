import React from "react";
import cursorImage from "../assets/cursor.png";

export default function Loader({ fullScreen = true }) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#0B1120] text-white transition-all duration-500 ${
        fullScreen
          ? "fixed inset-0 z-[9999] min-h-screen w-screen"
          : "w-full py-12"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-t-[#F5C518] border-r-transparent border-b-[#1E3A5F]/60 border-l-transparent shadow-lg"></div>

        {/* Inner pulsing ring with custom cursor image */}
        <div className="absolute h-12 w-12 animate-pulse rounded-full bg-[#1E3A5F]/85 border border-[#F5C518]/30 flex items-center justify-center shadow-inner overflow-hidden p-1.5">
          <img
            src={cursorImage}
            alt="Loading"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Dynamic text details */}
      <div className="mt-6 flex flex-col items-center text-center px-4">
        <h3 className="text-md font-semibold tracking-wider text-white/90 uppercase">
          FPOP Clinic Portal
        </h3>
        <p className="mt-1.5 text-xs text-white/40 tracking-widest uppercase">
          Loading secure session...
        </p>
      </div>
    </div>
  );
}
