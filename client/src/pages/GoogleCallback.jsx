import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      console.error('Google auth error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (!code) {
      console.error('No code received from Google');
      navigate('/login?error=no_code');
      return;
    }

    const guardKey = `oauth_processed_${code}`;
    if (sessionStorage.getItem(guardKey)) {
      console.log('[GoogleCallback] Code already processed, skipping');
      return;
    }
    sessionStorage.setItem(guardKey, '1');

    const handleGoogleLogin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/google/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google login failed');
        }

        sessionStorage.removeItem(guardKey);

        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } catch (err) {
        console.error('Google login error:', err.message);
        sessionStorage.removeItem(guardKey);
        navigate('/login?error=google_login_failed');
      }
    };

    handleGoogleLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-warm-grey dark:text-dark-text-secondary">Logging you in with Google...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;