// App.jsx
import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Bot from './components/Bot';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Handle navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Handle login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentPage('bot');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
  };

  // Handle registration
  const handleRegister = (userData) => {
    // After successful registration, log the user in
    handleLogin(userData);
  };

  // Render the appropriate component based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'login':
        return <Login navigateTo={navigateTo} onLogin={handleLogin} />;
      case 'register':
        return <Register navigateTo={navigateTo} onRegister={handleRegister} />;
      case 'bot':
        return <Bot user={user} onLogout={handleLogout} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;