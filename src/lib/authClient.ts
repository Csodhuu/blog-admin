import axios from "axios";

export const service = axios.create({
  baseURL: "https://backend.gatewaysportstravel.mn/api",
  withCredentials: true,
});

service.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window === "undefined") {
      return Promise.reject(err);
    }

    const status = err?.response?.status;
    const pathname = window.location.pathname;

    // 🚫 VERY IMPORTANT: do NOTHING on login/register pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return Promise.reject(err);
    }

    if (status === 401 || status === 403) {
      const redirect = encodeURIComponent(pathname + window.location.search);
      window.location.replace(`/login?redirect=${redirect}`);
    }

    return Promise.reject(err);
  }
);
