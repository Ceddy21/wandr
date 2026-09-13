import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


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

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  if (response.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);