import React, { useState } from 'react';
import { Plane, Eye, EyeOff, Hand, Sun, Moon } from 'lucide-react';

function Login({ theme, toggleTheme }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempted');
    }, 1500);
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
      ></div>

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(180deg, rgba(20,20,18,0.6), rgba(20,20,18,0.7))'
            : 'linear-gradient(180deg, rgba(247,247,245,0.3), rgba(247,247,245,0.5))'
        }}
      ></div>

      {/* Decorative Orbs */}
      <div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(220,139,110,0.4), transparent)'
            : 'radial-gradient(circle, rgba(196,106,77,0.3), transparent)'
        }}
        aria-hidden="true"
      ></div>
      <div 
        className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(231,111,81,0.3), transparent)'
            : 'radial-gradient(circle, rgba(45,106,79,0.2), transparent)'
        }}
        aria-hidden="true"
      ></div>

      {/* Theme Toggle */}
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
        ></div>

        {theme !== 'dark' && (
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, white, transparent)'
            }}
            aria-hidden="true"
          ></div>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#E76F51] text-white shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20 hover:scale-105 transition-transform duration-300">
            <Plane className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-dark-text mt-2">
            Wanderly
          </span>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-1 relative z-10">
          <Hand className="w-6 h-6 text-terracotta dark:text-dark-terracotta" />
          <h2 className="text-2xl font-bold text-center text-deep-charcoal dark:text-dark-text">
            Welcome back
          </h2>
        </div>

        <p className="text-center text-warm-grey dark:text-dark-text-secondary mt-1 mb-8 relative z-10">
          Log in to continue planning your trips
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg relative z-10">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-all duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] active:scale-95 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 touch-action-manipulation"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Logging in...
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="relative mt-6 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8eaed] dark:border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-warm-grey dark:text-dark-text-secondary">
              Don't have an account?
            </span>
          </div>
        </div>

        <div className="mt-4 text-center relative z-10">
          <a href="/signup" className="text-terracotta dark:text-dark-terracotta font-medium hover:underline hover:text-terracotta-hover dark:hover:text-[#c47050] transition-colors">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;