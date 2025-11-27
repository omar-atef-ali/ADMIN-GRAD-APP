import axios from "axios";

const api = axios.create({
  baseURL: "/api", // relative path → Netlify proxy هيوجهه للسيرفر
});



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      console.log("⛔ Token expired or invalid. Trying to refresh...");

      originalRequest._retry = true;

      try {
        const oldAccessToken = localStorage.getItem("token");

        console.log("🔑 Old Access Token:", oldAccessToken);
        console.log("🔄 Sending refresh request with Refresh Token:", refreshToken);

        const res = await api.post("/api/Auth/refresh", {
          token: oldAccessToken,
          refreshToken,
        });

        console.log("✅ Refresh successful:", res.data);

        const { token: newAccessToken, refreshToken: newRefreshToken } = res.data;

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        console.log("💾 New tokens saved to localStorage.");

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("📦 Retrying original request with new token:", originalRequest.url);

        return api(originalRequest);
      } catch (refreshError) {
        console.log("🔥 FULL refresh error object:", refreshError); 
        console.error("❌ Refresh token failed:", refreshError);
        localStorage.clear();

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);






export default api;