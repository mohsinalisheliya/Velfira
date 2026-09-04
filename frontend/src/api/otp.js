import axiosClient from "./axiosClient";

export const sendOtp = (mobile_number) =>
  axiosClient.post("/auth/otp/send/", { mobile_number });

// Teesra parameter profileData add kiya aur spread (...) kar diya
export const verifyOtp = (mobile_number, otp, profileData = {}) =>
  axiosClient.post("/auth/otp/verify/", { mobile_number, otp, ...profileData });