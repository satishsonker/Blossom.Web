import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { setToastCallback } from '../../services/api.service';
import '../../styles/components/ToastContainer.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Track recent toasts to prevent duplicates
    const recentToasts = new Map();
    
    // Register toast callback with API service
    setToastCallback(({ type, message, details = [] }) => {
      const messageKey = `${type}-${message}`;
      const now = Date.now();
      
      // Check if same message was shown in the last 2 seconds
      const lastShown = recentToasts.get(messageKey);
      if (lastShown && (now - lastShown) < 2000) {
        return; // Skip duplicate toast
      }
      
      // Update recent toasts map
      recentToasts.set(messageKey, now);
      
      // Clean up old entries (older than 5 seconds)
      for (const [key, timestamp] of recentToasts.entries()) {
        if (now - timestamp > 5000) {
          recentToasts.delete(key);
        }
      }
      
      const id = now + Math.random();
      setToasts(prev => [...prev, { id, type, message, details }]);
    });

    return () => {
      setToastCallback(null);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container-wrapper">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          details={toast.details}
          onClose={() => removeToast(toast.id)}
          duration={5000}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

