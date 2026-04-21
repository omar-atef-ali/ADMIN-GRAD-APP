import axios from "axios";

const api = axios.create({
  baseURL: "/api", // relative path → Netlify proxy هيوجهه للسيرفر
  withCredentials: true,
});


const refreshClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ القائمة السوداء - endpoints مش هتعمل refresh
const SKIP_REFRESH_URLS = ["/Auth/login", "/Auth/refresh", "/Auth/register"];

const shouldSkipRefresh = (url = "") =>
  SKIP_REFRESH_URLS.some((skip) => url.includes(skip));

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // console.log(`📤 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // console.log(`✅ [RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";
    const status = error.response?.status;

    // console.log(`❌ [ERROR] ${status} ${url}`);

    if (!error.response) {
      console.warn("🌐 [NETWORK ERROR] No response from server");
      return Promise.reject(error);
    }

    // ✅ لو الـ URL في القائمة السوداء → ارفض على طول
    if (shouldSkipRefresh(url)) {
      // console.log(`⛔ [SKIP REFRESH] ${url} is in the skip list`);
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      const oldToken = localStorage.getItem("token");

      if (!oldToken) {
        console.warn("⚠️ [REFRESH] No tokens found → rejecting");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // console.log("⏳ [REFRESH] Already refreshing → adding to queue");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      // console.log("🔄 [REFRESH] Starting token refresh...");

      return new Promise(async (resolve, reject) => {
        try {
          const res = await refreshClient.post("/Auth/refresh", {
            token: oldToken,
          });

          const newAccessToken = res.data?.token;

          if (!newAccessToken) {
            throw new Error("No token returned from refresh endpoint");
          }

          console.log("🎉 [REFRESH] New token received successfully");

          localStorage.setItem("token", newAccessToken);

          api.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          // console.log(`📬 [QUEUE] Processed ${failedQueue.length} queued requests`);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        } catch (refreshError) {
          console.error("💥 [REFRESH FAILED]", refreshError.message);
          processQueue(refreshError, null);

          const refreshStatus = refreshError.response?.status;
          if (!refreshStatus || [400, 401, 403].includes(refreshStatus)) {
            console.warn("🚪 [LOGOUT] Clearing storage and redirecting...");
            localStorage.clear();
            window.location.replace("/login");
          }

          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;