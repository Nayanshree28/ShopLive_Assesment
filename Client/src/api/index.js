import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',   // back-end URL
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network error';
    alert(message);
    return Promise.reject(error);
  }
);