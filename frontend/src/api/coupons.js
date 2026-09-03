import axiosClient from "./axiosClient";

export const applyCoupon = (code, subtotal) =>
  axiosClient.post("/coupons/apply/", { code, subtotal });