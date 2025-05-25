import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://shoplive-assesment-1.onrender.com',   // back-end URL
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