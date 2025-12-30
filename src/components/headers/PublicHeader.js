import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/PublicHeader.css';
import LoginPopup from '../popups/auth/LoginPopup';
import SignupPopup from '../popups/auth/SignupPopup';
import ForgotPasswordPopup from '../popups/auth/ForgotPasswordPopup';
import UserMenuPopup from '../popups/UserMenuPopup';

const PublicHeader = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const desktopUserMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);

  // Check for sessionExpired query parameter and show login popup
  useEffect(() => {
    const sessionExpired = searchParams.get('sessionExpired');
    if (sessionExpired === 'true' && !user) {
      setShowLoginModal(true);
      // Remove the query parameter from URL
      searchParams.delete('sessionExpired');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktopClick = desktopUserMenuRef.current && desktopUserMenuRef.current.contains(event.target);
      const isMobileClick = mobileUserMenuRef.current && mobileUserMenuRef.current.contains(event.target);
      
      if (!isDesktopClick && !isMobileClick) {
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
            <img 
              src="/assets/images/icons/icon-96x96.png" 
              alt="Blooming Buds Logo" 
              className="logo-image"
              width="32" 
              height="32"
            />
          </div>
          <h1 className="logo-text">Blooming Buds</h1>
        </Link>

        <nav className={`header-nav ${showMenu ? 'active' : ''}`}>
          <Link to="/" onClick={() => setShowMenu(false)}>Home</Link>
          <Link to="/about" onClick={() => setShowMenu(false)}>About</Link>
          <Link to="/contact" onClick={() => setShowMenu(false)}>Contact</Link>
          
          <div className="header-actions desktop-user-icon">
            <div className="user-icon-wrapper" ref={desktopUserMenuRef}>
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

        <div className="header-right-actions">
          <div className="user-icon-wrapper mobile-user-icon" ref={mobileUserMenuRef}>
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

          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      {showLoginModal && (
        <LoginPopup 
          setShowLoginModal={setShowLoginModal}
          onSwitchToSignup={() => setShowSignupModal(true)}
          onSwitchToForgotPassword={() => setShowForgotPasswordModal(true)}
        />
      )}
      {showSignupModal && (
        <SignupPopup 
          setShowSignupModal={setShowSignupModal}
          onSwitchToLogin={() => setShowLoginModal(true)}
        />
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordPopup 
          setShowForgotPasswordModal={setShowForgotPasswordModal}
          onSwitchToLogin={() => setShowLoginModal(true)}
        />
      )}
    </header>
  );
};

export default PublicHeader;

