import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const Icon = ({ type, className = "w-5 h-5" }) => {
  const paths = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    list: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    chevronDown: "M19 9l-7 7-7-7",
    menu: "M4 6h16M4 12h16M4 18h16",
    close: "M6 18L18 6M6 6l12 12",
    checkAll: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    check: "M5 13l4 4L19 7",
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  );
};

const NavLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      active
        ? "text-[#244783] bg-[#244783]/8"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
    }`}
  >
    <Icon type={icon} className="w-4 h-4" />
    <span>{label}</span>
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#244783] rounded-full" />
    )}
  </button>
);

const Navbar = ({
  currentView,
  profile,
  onNavigateToDashboard,
  onNavigateToBook,
  onNavigateToAppointments,
  onNavigateToProfile,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const { logout } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      setNotifLoading(true);
      const res = await fetch(`${__API_BASE__}/api/notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unread);
      }
    } catch {
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markRead = async (id) => {
    await fetch(`${__API_BASE__}/api/notifications/${id}/read`, {
      method: "PUT",
      credentials: "include",
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch(`${__API_BASE__}/api/notifications/read-all`, {
      method: "PUT",
      credentials: "include",
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const links = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", action: onNavigateToDashboard },
    { key: "booking", label: "Book Appointment", icon: "calendar", action: onNavigateToBook },
    { key: "appointments", label: "My Appointments", icon: "list", action: onNavigateToAppointments },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-11 items-center justify-between sm:h-16">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="group flex items-center gap-2 text-left"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#F5C518]/20 blur-md transition-all duration-300 group-hover:bg-[#F5C518]/30" />
              <img
                src="/logoo.png"
                alt="FPOP Clinic Portal"
                className="relative h-8 w-8 object-contain transition-all duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
              />
            </div>
            <div className="flex flex-col text-left leading-none">
              <h1 className="text-[10px] font-bold tracking-wide text-slate-800 transition-colors duration-300 group-hover:text-[#244783] sm:text-sm">
                FPOP Clinic Portal
              </h1>
              <span className="-mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#244783]/80 sm:text-[10px]">
                Healthcare Hub
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.key}
                icon={link.icon}
                label={link.label}
                active={currentView === link.key}
                onClick={link.action}
              />
            ))}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-[#244783]/8 hover:text-[#244783] sm:p-2"
              >
                <Icon type="bell" className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed left-3 right-3 top-12 z-[60] max-h-[calc(100dvh-4rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:max-h-none sm:w-[380px]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-[#244783] hover:text-[#1a3560] transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto sm:max-h-[360px]">
                    {notifLoading && notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-sm text-slate-400">
                        <Icon type="bell" className="w-8 h-8 mb-2 text-slate-300" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 transition-colors ${
                            !n.read ? "bg-[#244783]/4" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            !n.read ? "bg-[#244783]" : "bg-transparent"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!n.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.text}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                              {n.category && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                  {n.category}
                                </span>
                              )}
                            </div>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => markRead(n._id)}
                              className="mt-1 p-1 rounded text-slate-300 hover:text-[#244783] hover:bg-slate-100 transition-colors"
                              title="Mark as read"
                            >
                              <Icon type="check" className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg transition-all duration-200 ${
                  profileOpen || currentView === "profile"
                    ? "bg-[#244783]/8 text-[#244783]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#244783] to-[#1a3560] flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(profile?.name?.[0] || "U").toUpperCase()}</span>
                  )}
                </div>
                <Icon type="chevronDown" className="w-3.5 h-3.5" />
              </button>

              {profileOpen && (
                <div className="absolute right-4 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5">
                  <button
                    onClick={() => { onNavigateToProfile(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Icon type="user" className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Icon type="logout" className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-lg p-1.5 text-slate-500 transition-all hover:bg-[#244783]/8 hover:text-[#244783] sm:p-2"
            >
              <Icon type={mobileOpen ? "close" : "menu"} className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => { link.action(); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentView === link.key
                    ? "text-[#244783] bg-[#244783]/8"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon type={link.icon} className={`w-5 h-5 ${currentView === link.key ? "text-[#244783]" : "text-slate-400"}`} />
                {link.label}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <button
              onClick={() => { onNavigateToProfile(); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentView === "profile"
                  ? "text-[#244783] bg-[#244783]/8"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon type="user" className="w-5 h-5 text-slate-400" />
              My Profile
            </button>
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <Icon type="logout" className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
