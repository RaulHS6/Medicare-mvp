import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite lo redirige a localhost:4000
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar expiración de sesión (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
