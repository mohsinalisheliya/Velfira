import axiosClient from "./axiosClient";

export const getActiveTheme = () => axiosClient.get("/theme/active/");