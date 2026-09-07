'use client';

export function normalizeRole(role) {
  if (!role) return null;
  if (role === 'school_admin' || role === 'admin') return 'school_admin';
  if (role === 'enterprise_admin' || role === 'enterprise') return 'enterprise_admin';
  return role;
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('edupulse_user');
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('edupulse_token');
}

export function setAuth(token, user) {
  const normalizedUser = {
    ...user,
    role: normalizeRole(user?.role || user?.type || null),
  };

  localStorage.setItem('edupulse_token', token);
  localStorage.setItem('edupulse_user', JSON.stringify(normalizedUser));
}

export function clearAuth() {
  localStorage.removeItem('edupulse_token');
  localStorage.removeItem('edupulse_user');
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserRole() {
  const user = getUser();
  return normalizeRole(user?.role || user?.type || null);
}
