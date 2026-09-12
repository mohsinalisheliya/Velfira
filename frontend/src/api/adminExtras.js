import axiosClient from "./axiosClient";

export const listCoupons = () => axiosClient.get("/admin/coupons/");
export const createCoupon = (data) => axiosClient.post("/admin/coupons/", data);
export const updateCoupon = (id, data) => axiosClient.patch(`/admin/coupons/${id}/`, data);
export const deleteCoupon = (id) => axiosClient.delete(`/admin/coupons/${id}/`);

export const listBannersAdmin = () => axiosClient.get("/admin/banners/");


export const updateBanner = (id, data) => axiosClient.patch(`/admin/banners/${id}/`, data);
export const deleteBanner = (id) => axiosClient.delete(`/admin/banners/${id}/`);

export const listLogs = (params = {}) => axiosClient.get("/admin/logs/", { params });