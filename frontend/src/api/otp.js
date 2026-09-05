import axiosClient from "./axiosClient";

// Ab sendOtp mein bhi action jayega
export const sendOtp = (mobile_number, action) =>
  axiosClient.post("/auth/otp/send/", { mobile_number, action });

// Verify mein bhi action jayega
export const verifyOtp = (mobile_number, otp, profileData = {}, action) =>
  axiosClient.post("/auth/otp/verify/", { mobile_number, otp, ...profileData, action });