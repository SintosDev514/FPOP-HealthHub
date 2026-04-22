import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const StaffSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/staff/dashboard", icon: "dashboard" },
    { name: "Appointments", path: "/staff/appointments", icon: "calendar" },
    { name: "Calendar", path: "/staff/calendar", icon: "calendar-days" },
    { name: "Walk-Ins", path: "/staff/walk-ins", icon: "info" },
    { name: "Patients", path: "/staff/patients", icon: "users" },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setIsMobileMenuOpen(false);
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${
          isActive
            ? "bg-white/10 text-white font-bold"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {item.icon === "dashboard" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
          {(item.icon === "calendar" || item.icon === "calendar-days") && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
          {item.icon === "info" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          {item.icon === "users" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
        </svg>
        <span className="text-sm">{item.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1E3A5F] text-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm">FPOP Clinic</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#1E3A5F] pt-20 px-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col p-6 h-screen sticky top-0 hidden md:flex" style={{ backgroundColor: "#1E3A5F" }}>
        <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-6">
          <img src={logo} alt="FPOP Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">FPOP Clinic Portal</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Staff Dashboard</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
           <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-white/70 hover:bg-red-500/10 hover:text-red-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
             <span className="text-sm font-semibold">Logout</span>
           </button>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
