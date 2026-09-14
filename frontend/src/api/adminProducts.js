import axiosClient from "./axiosClient";

export const listAdminProducts = () => axiosClient.get("/admin/products/");
export const getAdminProduct = (id) => axiosClient.get(`/admin/products/${id}/`);
export const createProduct = (data) => axiosClient.post("/admin/products/", data);
export const updateProduct = (id, data) => axiosClient.patch(`/admin/products/${id}/`, data);
export const deleteProduct = (id) => axiosClient.delete(`/admin/products/${id}/`);
export const listAdminCategories = () => axiosClient.get("/categories/");

export const uploadProductMedia = (productId, images, videos) => {
  const fd = new FormData();
  images.forEach((f) => fd.append("images", f));
  videos.forEach((f) => fd.append("videos", f));
  return axiosClient.post(`/admin/products/${productId}/media/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteProductImage = (productId, imageId) =>
  axiosClient.delete(`/admin/products/${productId}/media/`, { data: { image_id: imageId } });
export const deleteProductVideo = (productId, videoId) =>
  axiosClient.delete(`/admin/products/${productId}/media/`, { data: { video_id: videoId } });

