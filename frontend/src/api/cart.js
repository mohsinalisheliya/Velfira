import axiosClient from "./axiosClient";

export const getCart = () => axiosClient.get("/cart/");
export const addToCart = (product_id, quantity = 1, variant_id = null) =>
  axiosClient.post("/cart/", { product_id, quantity, variant_id });
export const updateCartItem = (item_id, quantity) =>
  axiosClient.patch(`/cart/items/${item_id}/`, { quantity });
export const removeCartItem = (item_id) =>
  axiosClient.delete(`/cart/items/${item_id}/`);