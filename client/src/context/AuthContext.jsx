import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const normalizeUser = (data) => data?.user || data || null;

  const profileKey = (email) => `fpop_profile_${email || "unknown"}`;

  const restoreProfile = (email) => {
    try {
      return JSON.parse(localStorage.getItem(profileKey(email)) || "{}");
    } catch {
      return {};
    }
  };

  const persistProfile = (next) => {
    if (!next?.email) return;
    try {
      localStorage.setItem(
        profileKey(next.email),
        JSON.stringify({
          firstName: next.firstName || "",
          lastName: next.lastName || "",
          avatar: next.avatar || "",
        })
      );
    } catch {
      /* ignore storage errors */
    }
  };

  const updateProfile = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      persistProfile(next);
      return next;
    });
  };

  const checkAuth = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      const serverUser = normalizeUser(data);
      if (!serverUser) {
        setUser(null);
        return;
      }

      const saved = restoreProfile(serverUser.email);
      const merged = {
        ...serverUser,
        firstName: serverUser.firstName || saved.firstName || "",
        lastName: serverUser.lastName || saved.lastName || "",
        avatar: serverUser.avatar || saved.avatar || "",
      };
      setUser(merged);
      persistProfile(merged);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${__API_BASE__}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateProfile,
        loading,
        initialized,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
