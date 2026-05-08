import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

// ✅ RESPONSE INTERCEPTOR (handle session expiry)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 session expired → redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;