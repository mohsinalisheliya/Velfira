import axiosClient from "./axiosClient";

export const listProducts = (params = {}) => axiosClient.get("/products/", { params });
export const getProduct = (slug) => axiosClient.get(`/products/${slug}/`);
export const listCategories = () => axiosClient.get("/categories/");