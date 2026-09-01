import axiosClient from "./axiosClient";

export const sendOtp = (mobile_number) =>
  axiosClient.post("/auth/otp/send/", { mobile_number });

export const verifyOtp = (mobile_number, otp) =>
  axiosClient.post("/auth/otp/verify/", { mobile_number, otp });