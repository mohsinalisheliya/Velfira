import { createContext, useContext, useState, useEffect } from "react";
import { verifyOtp as verifyOtpApi, sendOtp as sendOtpApi } from "../api/otp";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("velfira_user");
    return saved ? JSON.parse(saved) : null;
  });

  const sendOtp = (mobile) => sendOtpApi(mobile);

  const verifyOtp = async (mobile, otp) => {
    const { data } = await verifyOtpApi(mobile, otp, );
    localStorage.setItem("velfira_access", data.access);
    localStorage.setItem("velfira_refresh", data.refresh);
    localStorage.setItem("velfira_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("velfira_access");
    localStorage.removeItem("velfira_refresh");
    localStorage.removeItem("velfira_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);