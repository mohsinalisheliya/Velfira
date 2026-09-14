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

export const listVariants = (productId) => axiosClient.get(`/admin/products/${productId}/variants/`);
export const createVariant = (productId, data) => axiosClient.post(`/admin/products/${productId}/variants/`, data);
export const deleteVariant = (id) => axiosClient.delete(`/admin/variants/${id}/`);

export const listRelated = (productId) => axiosClient.get(`/admin/products/${productId}/related/`);
export const createRelated = (productId, relatedProductId) => axiosClient.post(`/admin/products/${productId}/related/`, { related_product: relatedProductId });
export const deleteRelated = (id) => axiosClient.delete(`/admin/related/${id}/`);