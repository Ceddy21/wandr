import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Check, X, Sun, Moon } from 'lucide-react';

function Verify({ theme, toggleTheme }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const savedEmail = localStorage.getItem('pendingVerificationEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: fullCode }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setSuccess(true);
      localStorage.removeItem('pendingVerificationEmail');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setError('');
      alert('New verification code sent to your email!');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 transition-colors duration-300 overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(16px)',
          transform: 'scale(1.1)',
          opacity: theme === 'dark' ? 0.5 : 0.3
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(180deg, rgba(20,20,18,0.6), rgba(20,20,18,0.7))'
            : 'linear-gradient(180deg, rgba(247,247,245,0.3), rgba(247,247,245,0.5))'
        }}
      />

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft text-terracotta dark:text-dark-terracotta hover:bg-terracotta hover:text-white dark:hover:bg-dark-terracotta dark:hover:text-dark-bg transition-colors duration-300 z-20"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div 
        className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden z-10"
        style={{
          background: theme === 'dark'
            ? 'rgba(30, 30, 27, 0.7)'
            : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: theme === 'dark'
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0.4)',
          boxShadow: theme === 'dark'
            ? '0 25px 60px -15px rgba(0,0,0,0.5)'
            : '0 25px 60px -15px rgba(0,0,0,0.15)'
        }}
      >
        <div 
          className="absolute top-0 left-0 right-0 h-1" 
          style={{
            background: 'linear-gradient(90deg, #2D6A4F, #c46a4d, #E76F51)',
            boxShadow: '0 1px 8px rgba(196,106,77,0.3)'
          }}
        />

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#E76F51] text-white shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20 hover:scale-105 transition-transform duration-300">
            <Plane className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-dark-text mt-2">
            Wanderly
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center text-deep-charcoal dark:text-dark-text mb-2 relative z-10">
          Verify Your Email
        </h2>

        <p className="text-center text-warm-grey dark:text-dark-text-secondary mb-6 relative z-10">
          We sent a 6-digit code to <br />
          <span className="font-medium text-deep-charcoal dark:text-dark-text">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="relative z-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">Email verified! Redirecting to login...</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                disabled={isLoading || success}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] active:scale-95 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying...
              </div>
            ) : success ? (
              'Verified! ✓'
            ) : (
              'Verify Email'
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading || success}
            className="w-full mt-3 py-2 text-sm text-terracotta dark:text-dark-terracotta hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Didn't receive the code? Resend
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;