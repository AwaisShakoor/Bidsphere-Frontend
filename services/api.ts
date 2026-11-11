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
    "/api/verify-reset-otp",
    "/api/reset-password",
    "/api/verify-email",
    "/api/resend-otp",
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
        // Only bounce off protected app areas; public browse stays open for guests
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isProtectedArea =
            path.startsWith("/dashboard") ||
            path.startsWith("/admin") ||
            path.startsWith("/my-auctions") ||
            path.startsWith("/my-bids") ||
            path.startsWith("/checkout") ||
            path.startsWith("/payments") ||
            path.startsWith("/my-payments");
          if (isProtectedArea) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
