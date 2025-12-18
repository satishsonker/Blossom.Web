import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ChangePasswordPopup from './auth/ChangePasswordPopup';
import '../../styles/components/UserMenuPopup.css';

const UserMenuPopup = ({ isOpen, onClose, onLoginClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <>
      <div className="user-menu-overlay" onClick={onClose}></div>
      <div className="user-menu-popup">
        {user ? (
          <>
            <div className="user-menu-header">
              <div className="user-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="user-info">
                <div className="user-name">{user.name || 'User'}</div>
                <div className="user-email">{user.email || user.username || ''}</div>
                <div className="user-role">{user.roles ? (user.roles.find(x=>x.RoleCode==='ADMIN')!==null?"Admin" : user.roles[0].RoleCode):"Guest"}</div>
              </div>
            </div>
            <div className="user-menu-divider"></div>
            {isAdmin() && (
              <>
                <button 
                  className="user-menu-item"
                  onClick={() => {
                    onClose();
                    navigate('/admin/dashboard');
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <span>Admin Portal</span>
                </button>
                <div className="user-menu-divider"></div>
              </>
            )}
            <button className="user-menu-item" onClick={handleThemeToggle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {theme === 'light' ? (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none"/>
                ) : (
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                )}
              </svg>
              <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme</span>
            </button>
            <div className="user-menu-divider"></div>
            <button 
              className="user-menu-item" 
              onClick={() => {
                onClose();
                setShowChangePassword(true);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Change Password</span>
            </button>
            <div className="user-menu-divider"></div>
            <button className="user-menu-item logout-item" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <div className="user-menu-header">
              <div className="user-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="user-info">
                <div className="user-name">Guest</div>
                <div className="user-email">Not logged in</div>
              </div>
            </div>
            <div className="user-menu-divider"></div>
            <button className="user-menu-item" onClick={handleThemeToggle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {theme === 'light' ? (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none"/>
                ) : (
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                )}
              </svg>
              <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme</span>
            </button>
            <div className="user-menu-divider"></div>
            <button className="user-menu-item login-item" onClick={() => {
              onClose();
              onLoginClick();
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="10 17 15 12 10 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Login</span>
            </button>
          </>
        )}
      </div>
      {showChangePassword && (
        <ChangePasswordPopup setShowChangePasswordModal={setShowChangePassword} />
      )}
    </>
  );
};

export default UserMenuPopup;

