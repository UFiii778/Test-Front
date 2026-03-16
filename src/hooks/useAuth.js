// =====================================================
// FILE: frontend/src/hooks/useAuth.js
// DESKRIPSI: Authentication hook
// =====================================================

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Convenience hooks
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useHasRole = (role) => {
  const { hasRole } = useAuth();
  return hasRole(role);
};

export const useHasAnyRole = (roles) => {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(roles);
};

export const useHasPermission = (permission) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useRegister = () => {
  const { register } = useAuth();
  return register;
};

export const useUpdateUser = () => {
  const { updateUser } = useAuth();
  return updateUser;
};

export const useChangePassword = () => {
  const { changePassword } = useAuth();
  return changePassword;
};