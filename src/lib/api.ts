import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to headers on request
api.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token && config.headers && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 response and refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url?.includes("/users/login/") ||
                          originalRequest.url?.includes("/users/register/") ||
                          originalRequest.url?.includes("/users/token/refresh/") ||
                          originalRequest.url?.includes("/users/google-login/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        setCookie("access_token", access, 7);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies and force login redirect if refresh fails
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        deleteCookie("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
