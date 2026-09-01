import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';

function Header({ theme, toggleTheme }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    // TODO: Implement logout logic
    console.log('Logging out...');
  };

  return (
    <nav className="bg-white dark:bg-dark-card border-b border-[#e3e3dd] dark:border-dark-border px-4 sm:px-6 md:px-10 lg:px-20 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* LEFT SIDE: Logo + App Name */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">✈️</span>
          <span className="font-serif text-2xl font-bold text-deep-charcoal dark:text-dark-text group-hover:text-terracotta dark:group-hover:text-dark-terracotta transition-colors">
            Wanderly
          </span>
        </a>

        {/* RIGHT SIDE: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Trips Link */}
          <a href="/dashboard" className="text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors">
            Trips
          </a>

          {/* Profile Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center hover:ring-2 hover:ring-terracotta dark:hover:ring-dark-terracotta transition-all"
            >
              <User className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-[#e3e3dd] dark:border-dark-border rounded-xl shadow-lg overflow-hidden z-50">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-deep-charcoal dark:text-dark-text hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                >
                  <User className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-deep-charcoal dark:text-dark-text hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors w-full text-left border-t border-[#e3e3dd] dark:border-dark-border"
                >
                  <LogOut className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft text-terracotta dark:text-dark-terracotta hover:bg-terracotta hover:text-white dark:hover:bg-dark-terracotta dark:hover:text-dark-bg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* MOBILE: Hamburger Menu */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft text-terracotta dark:text-dark-terracotta hover:bg-terracotta hover:text-white dark:hover:bg-dark-terracotta dark:hover:text-dark-bg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-deep-charcoal dark:text-dark-text"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#e3e3dd] dark:border-dark-border">
          <a
            href="/dashboard"
            className="block py-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trips
          </a>
          <a
            href="/profile"
            className="block py-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </a>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="block py-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;