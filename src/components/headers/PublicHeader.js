import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/PublicHeader.css';
import LoginPopup from '../popups/auth/loginPopup';
import UserMenuPopup from '../popups/UserMenuPopup';

const PublicHeader = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h1 className="logo-text">Blossom</h1>
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
            <div className="user-icon-wrapper" ref={userMenuRef}>
              <button
                className="user-icon-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
              <UserMenuPopup 
                isOpen={showUserMenu} 
                onClose={() => setShowUserMenu(false)}
                onLoginClick={() => setShowLoginModal(true)}
              />
            </div>
          </div>
        </nav>
      </div>
      {showLoginModal && <LoginPopup setShowLoginModal={setShowLoginModal}></LoginPopup>}
    </header>
  );
};

export default PublicHeader;

