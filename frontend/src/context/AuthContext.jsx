import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { loginUser, refreshToken } from "../api/endpoints";

const AuthContext = createContext(null);

const STORAGE_KEY = "kilimo_auth";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { access: null, refresh: null };
  });

  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setAuth({ access: null, refresh: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ username, password });
      saveAuth({ access: data.access, refresh: data.refresh });
      return true;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  const ensureValidToken = useCallback(async () => {
    if (!auth.access || !auth.refresh) return null;
    if (!isTokenExpired(auth.access)) return auth.access;

    if (isTokenExpired(auth.refresh)) {
      logout();
      return null;
    }

    try {
      const { data } = await refreshToken({ refresh: auth.refresh });
      const updated = { access: data.access, refresh: data.refresh || auth.refresh };
      saveAuth(updated);
      return updated.access;
    } catch {
      logout();
      return null;
    }
  }, [auth.access, auth.refresh, logout, saveAuth]);

  useEffect(() => {
    if (!auth.access || !auth.refresh) return;

    const interval = setInterval(async () => {
      await ensureValidToken();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [auth.access, auth.refresh, ensureValidToken]);

  const value = useMemo(
    () => ({
      accessToken: auth.access,
      refreshToken: auth.refresh,
      isAuthenticated: Boolean(auth.access),
      loading,
      login,
      logout,
      ensureValidToken,
      saveAuth,
    }),
    [auth.access, auth.refresh, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
