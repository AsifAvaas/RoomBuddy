import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedAdmin = localStorage.getItem("isAdmin");

    if (storedLogin === "true") setIsLoggedIn(true);
    if (storedAdmin === "true") setIsAdmin(true);
  }, []);

  const login = (adminStatus) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", adminStatus ? "true" : "false");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
