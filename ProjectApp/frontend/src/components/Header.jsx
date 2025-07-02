import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../services/auth';

export default function Header() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-title">
        <h1>Cultural Sites of Chemnitz</h1>
      </div>

      <div className="header-nav-container">
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {!user && <Link to="/register">Register</Link>}
          {!user && <Link to="/login">Login</Link>}
          {user && <Link to="/favorites">Favorites</Link>}
          {user && <Link to="/visited">Visited</Link>}
          {user && <Link to="/ten-minute">Ten-Minute View</Link>}
          {user && <Link to="/trade">Trade</Link>}
          {user && <Link to="/trade-inbox">Trade Inbox</Link>} 
          <Link to="/about">About</Link>
        </nav>

        {user && (
          <div className="user-info">
            <Link to="/account" style={{ textDecoration: 'none', color: 'white' }}>
              <span> {user.name}</span>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
