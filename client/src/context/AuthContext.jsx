import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const normalizeUser = (data) => data?.user || data || null;

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
      setUser(normalizeUser(data));
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
