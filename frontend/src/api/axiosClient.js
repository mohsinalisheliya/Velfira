import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,

});

// Attach access token to every request
axiosClient.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("velfira_admin_access");
  const customerToken = localStorage.getItem("velfira_access");
  const isAdminRoute = config.url && config.url.indexOf("/admin") !== -1;
  const token = isAdminRoute && adminToken ? adminToken : customerToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// On 401, try refreshing the token once, then retry the original request
let isRefreshing = false;
let queue = [];

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("velfira_refresh");
      if (!refresh) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axiosClient(original);
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem("velfira_access", data.access);
        queue.forEach((p) => p.resolve(data.access));
        queue = [];
        original.headers.Authorization = `Bearer ${data.access}`;
        return axiosClient(original);
      } catch (refreshError) {
        localStorage.removeItem("velfira_access");
        localStorage.removeItem("velfira_refresh");
        queue.forEach((p) => p.reject(refreshError));
        queue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAdminRoute = err.config?.url?.includes("/admin");
      if (isAdminRoute) {
        localStorage.removeItem("velfira_admin_access");
        localStorage.removeItem("velfira_admin_refresh");
        localStorage.removeItem("velfira_admin_username");
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      } else {
        localStorage.removeItem("velfira_access");
        localStorage.removeItem("velfira_refresh");
        localStorage.removeItem("velfira_user");
        if (!window.location.pathname.includes("/account")) {
          window.location.href = "/account";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;