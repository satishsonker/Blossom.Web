import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/>
        </svg>
      )
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v0" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      path: '/admin/file-upload', 
      label: 'File Upload', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      path: '/admin/master-data', 
      label: 'Master Data', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
          <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={onClose}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;

