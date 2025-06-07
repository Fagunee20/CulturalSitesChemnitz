// src/services/auth.js

export function saveToken(token, user) {
  localStorage.setItem('auth_token', token);
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function getUser() {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

// ✅ Add this function:
export function saveUser(user) {
  localStorage.setItem('auth_user', JSON.stringify(user));
}
