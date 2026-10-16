import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Only one refresh at a time (stops parallel 401s from spamming refresh)
let refreshPromise: Promise<unknown> | null = null;

function shouldSkipRefresh(url?: string) {
  if (!url) return false;
  return [
    "/api/refresh",
    "/api/login",
    "/api/register",
    "/api/logout",
    "/api/forgot-password",
    "/api/reset-password",
    "/api/verify-email",
  ].some((path) => url.includes(path));
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest?.url)
    ) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= api.post("/api/refresh").finally(() => {
          refreshPromise = null;
        });

        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
