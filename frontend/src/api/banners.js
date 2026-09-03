import axiosClient from "./axiosClient";

export const listBanners = (position = "home_hero") =>
  axiosClient.get("/banners/", { params: { position } });