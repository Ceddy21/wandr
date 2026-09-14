import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let csrfTokenCache = null;

const fetchCsrfToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/csrf-token`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    csrfTokenCache = data.csrfToken;
    return csrfTokenCache;
  } catch {
    return null;
  }
};

const originalFetch = window.fetch;

const AUTH_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify',
  '/api/auth/google',
  '/api/auth/forgot-password',
  '/api/auth/verify-reset-code',
  '/api/auth/reset-password',
  '/api/auth/resend-verification',
  '/api/auth/change-password',
  '/api/auth/account/request-delete',
  '/api/auth/account',
];

const PUBLIC_PAGES = [
  '/',
  '/login',
  '/signup',
  '/verify',
  '/google-callback',
];

window.fetch = async (input, init = {}) => {
  const method = (init.method || 'GET').toUpperCase();
  const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  if (needsCsrf) {
    if (!csrfTokenCache) {
      await fetchCsrfToken();
    }
    if (csrfTokenCache) {
      init.headers = {
        ...init.headers,
        'x-csrf-token': csrfTokenCache,
      };
    }
  }

  let response = await originalFetch(input, init);

  if (response.status === 403 && needsCsrf) {
    csrfTokenCache = null;
    await fetchCsrfToken();

    if (csrfTokenCache) {
      init.headers['x-csrf-token'] = csrfTokenCache;
      response = await originalFetch(input, init);
    }
  }

  if (response.status === 401) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const path = window.location.pathname;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      url.includes(endpoint)
    );
    const isOnPublicPage = PUBLIC_PAGES.some(
      (p) => path === p || path.startsWith(`${p}/`)
    );

    if (!isAuthEndpoint && !isOnPublicPage) {
      localStorage.removeItem('user');
      window.location.href = '/login?reason=session_expired';
    }
  }

  return response;
};

fetchCsrfToken();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);