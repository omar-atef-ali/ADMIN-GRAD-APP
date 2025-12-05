import axios from "axios";

const api = axios.create({
  baseURL: "/api", // relative path → Netlify proxy هيوجهه للسيرفر
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // console.log("📤 Sending request:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // === 401 AND not retried before ===
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("⛔ 401 detected for:", originalRequest.url);

      const refreshToken = localStorage.getItem("refreshToken");
      const oldToken = localStorage.getItem("token");

      if (!refreshToken) {
        console.log("❌ No refresh token → logout");
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        console.log("⏳ Refresh already in progress → queue request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            console.log("🔁 Retrying queued request:", originalRequest.url);
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      console.log("♻️ Starting refresh flow...");

      try {
        // أهم نقطة — استخدم نفس instance (api) مش axios
        const res = await api.post("/Auth/refresh", {
          token: oldToken,
          refreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        console.log("✅ Refresh success");
        console.log("🔐 New token:", newAccessToken);

        // حل كل requests اللي كانت مستنية
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // retry للطلب اللي فشل
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        console.log("🔁 Retrying original request:", originalRequest.url);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed. Logging out...");
        console.log("🔥 Full error:", refreshError);

        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.clear();
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
