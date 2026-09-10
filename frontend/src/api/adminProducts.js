import axiosClient from "./axiosClient";

export const listAdminProducts = () => axiosClient.get("/admin/products/");
export const getAdminProduct = (id) => axiosClient.get(`/admin/products/${id}/`);
export const createProduct = (data) => axiosClient.post("/admin/products/", data);
export const updateProduct = (id, data) => axiosClient.patch(`/admin/products/${id}/`, data);
export const deleteProduct = (id) => axiosClient.delete(`/admin/products/${id}/`);
export const listAdminCategories = () => axiosClient.get("/categories/");