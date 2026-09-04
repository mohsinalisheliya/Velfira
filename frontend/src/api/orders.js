import axiosClient from "./axiosClient";

export const checkout = (payload) => axiosClient.post("/checkout/", payload);
export const listOrders = () => axiosClient.get("/orders/");
export const getOrder = (id) => axiosClient.get(`/orders/${id}/`);