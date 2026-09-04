import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/ui/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import TripDetail from './pages/TripDetail';

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/calendar') || location.pathname.startsWith('/trip') ;

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-warm-white dark:bg-dark-bg transition-colors duration-300">
      {isDashboardPage && <Header theme={theme} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/signup" element={<Signup theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/trip/:id" element={<TripDetail />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;