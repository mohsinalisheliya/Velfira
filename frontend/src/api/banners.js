import axiosClient from "./axiosClient";

export const listBanners = (position = "homepage_hero") =>
  axiosClient.get("/banners/", { params: { position } });