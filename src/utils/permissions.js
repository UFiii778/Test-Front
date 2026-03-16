// =====================================================
// FILE: frontend/src/utils/permissions.js
// DESKRIPSI: Permission utilities
// =====================================================

import { ROLES } from './constants';

/**
 * Permission definitions per role
 */
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'user:read',
    'user:write',
    'user:delete',
    'user:verify',
    'hospital:read',
    'hospital:write',
    'hospital:delete',
    'blood:read',
    'blood:write',
    'blood:delete',
    'request:read',
    'request:write',
    'request:delete',
    'appointment:read',
    'appointment:write',
    'appointment:delete',
    'news:read',
    'news:write',
    'news:delete',
    'report:read',
    'report:generate',
    'system:configure'
  ],

  [ROLES.PMI]: [
    'user:read',
    'user:verify',
    'hospital:read',
    'hospital:write',
    'blood:read',
    'blood:write',
    'request:read',
    'request:update',
    'appointment:read',
    'report:read',
    'emergency:manage'
  ],

  [ROLES.SUKARELAWAN]: [
    'user:read',
    'hospital:read',
    'blood:read',
    'request:read',
    'request:update',
    'donor:coordinate',
    'activity:create'
  ],

  [ROLES.PENDONOR]: [
    'profile:read',
    'profile:write',
    'hospital:read',
    'blood:read',
    'request:read',
    'response:create',
    'donation:history'
  ],

  [ROLES.PASIEN]: [
    'profile:read',
    'profile:write',
    'hospital:read',
    'blood:read',
    'request:create',
    'request:read',
    'appointment:create',
    'appointment:read'
  ]
};

/**
 * Check if user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  
  if (user.role === ROLES.ADMIN) return true;
  
  const userPermissions = PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the permissions
 */
export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all permissions
 */
export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user can access resource
 */
export const canAccessResource = (user, resource, ownerId) => {
  if (!user) return false;
  
  // Admin can access everything
  if (user.role === ROLES.ADMIN) return true;
  
  // Check ownership
  if (ownerId && user.id === ownerId) return true;
  
  // Check role-based access
  const resourcePermissions = {
    user: ['user:read', 'user:write'],
    hospital: ['hospital:read', 'hospital:write'],
    blood: ['blood:read', 'blood:write'],
    request: ['request:read', 'request:write'],
    appointment: ['appointment:read', 'appointment:write'],
    news: ['news:read', 'news:write']
  };

  const requiredPermissions = resourcePermissions[resource] || [];
  return hasAnyPermission(user, requiredPermissions);
};

/**
 * Get user permissions list
 */
export const getUserPermissions = (user) => {
  if (!user || !user.role) return [];
  
  if (user.role === ROLES.ADMIN) {
    // Admin has all permissions
    return Object.values(PERMISSIONS).flat();
  }
  
  return PERMISSIONS[user.role] || [];
};

/**
 * Check if user can perform action on resource
 */
export const can = (user, action, resource) => {
  const permission = `${resource}:${action}`;
  return hasPermission(user, permission);
};

/**
 * Check if user can create resource
 */
export const canCreate = (user, resource) => {
  return can(user, 'create', resource);
};

/**
 * Check if user can read resource
 */
export const canRead = (user, resource) => {
  return can(user, 'read', resource);
};

/**
 * Check if user can update resource
 */
export const canUpdate = (user, resource) => {
  return can(user, 'update', resource);
};

/**
 * Check if user can delete resource
 */
export const canDelete = (user, resource) => {
  return can(user, 'delete', resource);
};

/**
 * Check if user can verify resource
 */
export const canVerify = (user, resource) => {
  return can(user, 'verify', resource);
};

/**
 * Check if user can manage emergency
 */
export const canManageEmergency = (user) => {
  return hasPermission(user, 'emergency:manage');
};

/**
 * Check if user can coordinate donor
 */
export const canCoordinateDonor = (user) => {
  return hasPermission(user, 'donor:coordinate');
};

/**
 * Check if user can view reports
 */
export const canViewReports = (user) => {
  return hasPermission(user, 'report:read');
};

/**
 * Check if user can generate reports
 */
export const canGenerateReports = (user) => {
  return hasPermission(user, 'report:generate');
};

/**
 * Check if user can configure system
 */
export const canConfigureSystem = (user) => {
  return hasPermission(user, 'system:configure');
};

/**
 * Get role label
 */
export const getRoleLabel = (role) => {
  const labels = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.PMI]: 'PMI',
    [ROLES.SUKARELAWAN]: 'Sukarelawan',
    [ROLES.PASIEN]: 'Pasien',
    [ROLES.PENDONOR]: 'Pendonor'
  };
  return labels[role] || role;
};

/**
 * Get role color
 */
export const getRoleColor = (role) => {
  const colors = {
    [ROLES.ADMIN]: 'purple',
    [ROLES.PMI]: 'blue',
    [ROLES.SUKARELAWAN]: 'green',
    [ROLES.PASIEN]: 'yellow',
    [ROLES.PENDONOR]: 'red'
  };
  return colors[role] || 'gray';
};

/**
 * Get role badge class
 */
export const getRoleBadgeClass = (role) => {
  const colors = getRoleColor(role);
  return `badge-${colors}`;
};