import { createContext, useContext, useState } from "react";
import { verifyOtp as verifyOtpApi, sendOtp as sendOtpApi } from "../api/otp";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("velfira_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Action add kiya
  const sendOtp = (mobile, action) => sendOtpApi(mobile, action);

  // Action add kiya
  const verifyOtp = async (mobile, otp, profileData = {}, action) => {
    const { data } = await verifyOtpApi(mobile, otp, profileData, action);
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