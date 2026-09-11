import axiosClient from "./axiosClient";

export const listAdminOrders = () => axiosClient.get("/admin/orders/");
export const getAdminOrder = (id) => axiosClient.get(`/admin/orders/${id}/`);
export const updateOrderStatus = (id, status) => axiosClient.patch(`/admin/orders/${id}/`, { status });