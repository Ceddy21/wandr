import React, { useState, useRef, useEffect } from 'react';
import {
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

// ═══════════════════════════════════════════════════════════
// LOGO CONFIG — tweak these to resize the logo
// ═══════════════════════════════════════════════════════════

// Cloudinary URL (optimized)
const LOGO_URL =
  'https://res.cloudinary.com/sqlrnnth/image/upload/w_320,h_320,c_fit,q_auto,f_auto/v1789228245/wandr_nologo.png';

// Logo height in pixels for each breakpoint
const LOGO_SIZE = {
  mobile: 64,   // < 640px
  tablet: 72,   // 640–767px
  desktop: 80,  // ≥ 768px
};

// Text size — scales proportionally with the logo
const TEXT_SIZE = {
  mobile: 'text-2xl',   // 24px
  tablet: 'text-3xl',   // 30px
  desktop: 'text-3xl',  // 30px
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

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
        {/* ─── Logo + Wordmark ─────────────────────────── */}
        <a
          href="/dashboard"
          className="flex items-center gap-3 group hover:opacity-90 transition-opacity duration-200"
        >
          {/* Logo image — sized via inline style for precise control */}
          <img
            src={LOGO_URL}
            alt="Wandr logo"
            width={LOGO_SIZE.desktop}
            height={LOGO_SIZE.desktop}
            style={{
              height: 'clamp(48px, 5vw, 64px)',  // responsive, bounded
              width: 'auto',
            }}
            className="object-contain"
          />
          <span
            className={`font-serif font-bold text-[#1A1A1A] dark:text-dark-text group-hover:text-[#2D6A4F] dark:group-hover:text-[#E76F51] transition-colors duration-300 tracking-tight ${TEXT_SIZE.desktop}`}
          >
            Wandr
          </span>
        </a>

        {/* ─── Desktop nav ────────────────────────────── */}
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

        {/* ─── Right cluster ──────────────────────────── */}
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

        {/* ─── Mobile controls ────────────────────────── */}
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

      {/* ─── Mobile menu ──────────────────────────────── */}
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