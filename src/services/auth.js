import api from './api';

const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  isAuthenticated: () => !!localStorage.getItem('dk_token'),
  getToken: () => localStorage.getItem('dk_token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('dk_user')); } catch { return null; }
  },
};

export default authService;
