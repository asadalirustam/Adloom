import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to automatically append JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adloom_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on login page, can clear token
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // localStorage.removeItem('adloom_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
