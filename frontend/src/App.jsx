import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Bot from './components/Bot';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
      setCurrentPage('bot');
    }
    setLoading(false);
  }, []);

  // Handle navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Handle login
  const handleLogin = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentPage('bot');
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle registration
  const handleRegister = (userData, token) => {
    // After successful registration, log the user in
    handleLogin(userData, token);
  };

  // Render the appropriate component based on currentPage state
  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    switch(currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} isLoggedIn={isLoggedIn} />;
      case 'login':
        return <Login navigateTo={navigateTo} onLogin={handleLogin} />;
      case 'register':
        return <Register navigateTo={navigateTo} onRegister={handleRegister} />;
      case 'bot':
        return <Bot user={user} onLogout={handleLogout} />;
      default:
        return <Home navigateTo={navigateTo} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;