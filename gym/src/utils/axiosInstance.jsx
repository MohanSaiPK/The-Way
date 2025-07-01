// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://gym-backend-nyw8.onrender.com/api",
  headers: { "Content-Type": "application-json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Refresh token logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const response = await axios.post(
          "https://gym-backend-nyw8.onrender.com/api/token/refresh/",
          {
            refresh,
          }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("token", newAccessToken);

        // Update the Authorization header and retry
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
