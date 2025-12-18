import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/AdminHeader.css';
import UserMenuPopup from '../popups/UserMenuPopup';

const AdminHeader = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <header className="admin-header">
      <div className="admin-header-container">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <Link to="/" className="admin-logo">
          <div className="logo-icon">
            <img 
              src="/assets/images/logo.svg" 
              alt="Blossom Logo" 
              className="logo-image"
              width="28" 
              height="28"
            />
          </div>
          <h1 className="admin-title">Blossom</h1>
        </Link>
        
        <div className="admin-header-actions">
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
              onLoginClick={() => {}}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

