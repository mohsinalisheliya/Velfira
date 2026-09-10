import axiosClient from "./axiosClient";

export const adminLogin = (username, password) =>
  axiosClient.post("/auth/admin/login/", { username, password });

export const getSalesSummary = () => axiosClient.get("/admin/analytics/summary/");
export const getTopProducts = () => axiosClient.get("/admin/analytics/top-products/");
export const getRevenueTrend = (days = 30) => axiosClient.get("/admin/analytics/revenue-trend/", { params: { days } });
export const getLowStock = (threshold = 5) => axiosClient.get("/admin/analytics/low-stock/", { params: { threshold } });
export const getRecentOrders = () => axiosClient.get("/admin/analytics/recent-orders/");