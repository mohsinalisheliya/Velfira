import axiosClient from "./axiosClient";

export const initiatePayment = (orderId) =>
  axiosClient.post(`/payments/${orderId}/initiate/`);