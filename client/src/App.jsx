import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/ui/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import TripDetail from './pages/TripDetail';
import TripList from './pages/TripList';
import ProfilePage from './pages/Profile';
import RecentActivity from './pages/RecentActivity';
import Notifications from './pages/Notifications';
import GoogleCallback from './pages/GoogleCallback';
import Verify from './pages/Verify';
import Archive from './pages/Archive';

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/calendar') ||
                          location.pathname.startsWith('/trip') ||
                          location.pathname.startsWith('/trips') ||
                          location.pathname.startsWith('/profile') ||
                          location.pathname.startsWith('/activity') ||
                          location.pathname.startsWith('/notifications') ||
                          location.pathname.startsWith('/archive');

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
        <Route path="/trips" element={<TripList />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/activity" element={<RecentActivity />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/verify" element={<Verify theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/archive" element={<Archive />} />
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