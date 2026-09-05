import axiosClient from "./axiosClient";

export const listAddresses = () => axiosClient.get("/auth/addresses/");
export const createAddress = (payload) => axiosClient.post("/auth/addresses/", payload);
export const updateAddress = (id, payload) => axiosClient.patch(`/auth/addresses/${id}/`, payload);
export const deleteAddress = (id) => axiosClient.delete(`/auth/addresses/${id}/`);
export const updateProfile = (payload) => axiosClient.patch("/auth/profile/", payload);