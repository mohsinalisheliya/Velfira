import axiosClient from "./axiosClient";

export const listAddresses = () => axiosClient.get("/auth/addresses/");
export const createAddress = (payload) => axiosClient.post("/auth/addresses/", payload);
