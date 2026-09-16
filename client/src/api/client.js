import axios from "axios";

// Locally, Vite's dev server proxies "/api" to localhost:4000 (see
// vite.config.js). In production there's no such proxy, so VITE_API_URL
// must point at the real deployed API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("warden_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 = the token itself is dead (expired/invalid/user gone). 423 = the
// account was just disabled mid-session. Both mean "sign out now" — but a
// plain 403 (insufficient permission, or "can't approve your own request")
// is a normal, expected response the calling page already handles inline,
// so it must NOT force a logout.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if ((status === 401 || status === 423) && localStorage.getItem("warden_token")) {
      localStorage.removeItem("warden_token");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
