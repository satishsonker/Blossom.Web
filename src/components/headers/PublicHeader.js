import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/PublicHeader.css';

const PublicHeader = () => {
  const { user, logout, isAdmin, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    if (result.success) {
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      if (isAdmin()) {
        navigate('/admin/dashboard');
      }
    } else {
      alert(result.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Blossom</h1>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${showMenu ? 'active' : ''}`}>
          <Link to="/" onClick={() => setShowMenu(false)}>Home</Link>
          <Link to="/about" onClick={() => setShowMenu(false)}>About</Link>
          <Link to="/contact" onClick={() => setShowMenu(false)}>Contact</Link>
          
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            {user ? (
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                {isAdmin() && (
                  <Link to="/admin/dashboard" className="admin-link">
                    Admin Portal
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
            <p className="demo-credentials">
              Demo: admin@example.com / admin123
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;

