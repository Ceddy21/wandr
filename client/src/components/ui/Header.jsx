import React, { useState, useRef, useEffect } from 'react';
import { Plane, Sun, Moon, User, LogOut, Menu, X, Compass } from 'lucide-react';

function Header({ theme, toggleTheme }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <nav className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-[#e8eaed] dark:border-dark-border px-4 sm:px-6 md:px-10 lg:px-20 py-3 sm:py-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            <Compass className="w-4 h-4" />
            Trips
          </a>
        </div>

        {/* Profile + Theme Toggle */}
        <div className="flex items-center gap-1">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#E76F51] flex items-center justify-center hover:ring-2 hover:ring-[#2D6A4F]/30 dark:hover:ring-[#E76F51]/30 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Profile Menu"
            >
              <User className="w-4 h-4 text-white" />
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
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-colors duration-150 w-full text-left border-t border-[#e8eaed] dark:border-dark-border"
                >
                  <LogOut className="w-4 h-4 text-[#2D6A4F] dark:text-[#E76F51]" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-1 p-2 rounded-lg bg-[#F0F2F5] dark:bg-dark-card/50 text-[#4A4A4A] dark:text-dark-text-secondary hover:bg-[#E8EAED] dark:hover:bg-dark-card transition-all duration-200 hover:scale-105"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#e8eaed] dark:border-dark-border animate-in slide-in-from-top-2 duration-200">
          <a
            href="/dashboard"
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Compass className="w-4 h-4" />
            Trips
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
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 py-3 px-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-[#E76F51] hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 rounded-lg transition-all duration-150 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;