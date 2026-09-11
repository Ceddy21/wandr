import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Activity,
  LayoutDashboard,
  Archive,       
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function Header({ theme, toggleTheme }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.user) {
        setUser(event.detail.user);
        localStorage.setItem('user', JSON.stringify(event.detail.user));
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      localStorage.removeItem('user');
      localStorage.removeItem('pendingVerificationEmail');

      setUser(null);
      setIsDropdownOpen(false);

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('pendingVerificationEmail');
      setUser(null);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-[#e8eaed] dark:border-dark-border px-4 sm:px-6 md:px-10 lg:px-20 py-3 sm:py-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D6A4F] to-[#E76F51] rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative p-1.5 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#E76F51] text-white shadow-md">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-dark-text group-hover:text-[#2D6A4F] dark:group-hover:text-[#E76F51] transition-colors duration-300 tracking-tight">
            Wandr
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </a>
          <a
            href="/trips"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            <Compass className="w-4 h-4" />
            Trips
          </a>
          <a
            href="/activity"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            <Activity className="w-4 h-4" />
            Activity
          </a>
          <a
            href="/archive"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            <Archive className="w-4 h-4" />
            Archive
          </a>
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#E76F51] flex items-center justify-center hover:ring-2 hover:ring-[#2D6A4F]/30 dark:hover:ring-[#E76F51]/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
              aria-label="Profile Menu"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {getUserInitials()}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-colors duration-150"
                >
                  <User className="w-4 h-4 text-[#2D6A4F] dark:text-[#E76F51]" />
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-colors duration-150 w-full text-left border-t border-[#e8eaed] dark:border-dark-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4 text-[#2D6A4F] dark:text-[#E76F51]" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="ml-1 p-2 rounded-lg bg-[#F0F2F5] dark:bg-dark-card/50 text-[#4A4A4A] dark:text-dark-text-secondary hover:bg-[#E8EAED] dark:hover:bg-dark-card transition-all duration-200 hover:scale-105"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#F0F2F5] dark:bg-dark-card/50 text-[#4A4A4A] dark:text-dark-text-secondary hover:bg-[#E8EAED] dark:hover:bg-dark-card transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#F0F2F5] dark:bg-dark-card/50 text-[#1A1A1A] dark:text-dark-text hover:bg-[#E8EAED] dark:hover:bg-dark-card transition-all duration-200"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#e8eaed] dark:border-dark-border animate-in slide-in-from-top-2 duration-200">
          <a
            href="/dashboard"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </a>
          <a
            href="/trips"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Compass className="w-4 h-4" />
            Trips
          </a>
          <a
            href="/activity"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Activity className="w-4 h-4" />
            Activity
          </a>
          <a
            href="/archive"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Archive className="w-4 h-4" />
            Archive
          </a>
          <a
            href="/profile"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="w-4 h-4" />
            Profile
          </a>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;