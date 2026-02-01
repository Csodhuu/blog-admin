import axios from "axios";

import { getCookie } from "cookies-next";

export const service = axios.create({
  baseURL: "https://backend.gatewaysportstravel.mn/api",
});

const isAuthRoute = (pathname: string) =>
  pathname === "/" || pathname.startsWith("/login");

service.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getCookie("accessToken") : null;
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

service.interceptors.response.use(
  (res) => {
    if (
      res.data?.message === "Unauthorized" &&
      typeof window !== "undefined" &&
      !isAuthRoute(window.location.pathname)
    ) {
      window.location.href = "/login";
    }
    return res;
  },
  (err) => {
    const status = err?.response?.status;

    if (
      typeof window !== "undefined" &&
      (status === 401 || status === 403) &&
      !isAuthRoute(window.location.pathname)
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);
