import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_URL,
  headers: { Accept: "application/json" },
});

// Add token dynamically before each request
api.interceptors.request.use((config) => {
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    const token = user ? user.token : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // global 401 handler
    if (err?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;