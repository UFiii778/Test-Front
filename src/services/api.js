import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan';
    if (error.response?.status === 401) {
      localStorage.removeItem('dk_token');
      localStorage.removeItem('dk_user');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Coba lagi nanti.');
    }
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
