import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * SECURITY NOTE:
 * Storing JWTs in localStorage is common but makes the token vulnerable to XSS attacks.
 * If a malicious script runs on the site, it can steal the token.
 * For higher security applications, consider storing the JWT in an HttpOnly, Secure cookie.
 * This requires backend cooperation to set the cookie on login and a mechanism to handle CSRF.
 * For this project's scope, localStorage is a pragmatic choice.
 */

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
