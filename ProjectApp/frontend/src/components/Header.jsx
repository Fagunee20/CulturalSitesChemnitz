// ✅ FIXED: src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <header className="header">
      <h1>Cultural Sites of Chemnitz</h1>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/docs">Docs</Link>
        <Link to="/about">About</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}
