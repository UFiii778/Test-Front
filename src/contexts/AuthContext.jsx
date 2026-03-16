import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dk_user');
    const token = localStorage.getItem('dk_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch(e) {}
    }
    setLoading(false);
    setInitialized(true);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('dk_user', JSON.stringify(data.data));
        localStorage.setItem('dk_token', data.data.token || data.token);
        toast.success('Login berhasil!');
        return { success: true };
      }
      toast.error(data.message || 'Login gagal');
      return { success: false, error: data.message };
    } catch {
      toast.error('Gagal terhubung ke server');
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('dk_user', JSON.stringify(data.data));
        localStorage.setItem('dk_token', data.data.token || data.token);
        toast.success('Registrasi berhasil!');
        return { success: true };
      }
      toast.error(data.message || 'Registrasi gagal');
      return { success: false, error: data.message };
    } catch {
      toast.error('Gagal terhubung ke server');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dk_user');
    localStorage.removeItem('dk_token');
    toast.success('Logout berhasil');
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem('dk_user', JSON.stringify(updated));
  };

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, initialized,
      login, register, logout, updateUser,
      hasRole, hasAnyRole, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
