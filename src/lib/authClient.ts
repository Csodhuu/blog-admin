import axios from "axios";
import { getAccessToken } from "@/utils/authToken";

export const ImageURL = "https://backend.gatewaysportstravel.mn/";

export const service = axios.create({
  baseURL: "https://backend.gatewaysportstravel.mn/api",
});

/* ✅ REQUEST interceptor */
service.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ✅ RESPONSE interceptor */
service.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window === "undefined") return Promise.reject(err);

    const status = err?.response?.status;
    const pathname = window.location.pathname;

    if (pathname.startsWith("/login")) return Promise.reject(err);

    if (status === 401) {
      window.location.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`
      );
    }

    return Promise.reject(err);
  }
);
