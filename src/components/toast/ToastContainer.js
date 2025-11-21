import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { setToastCallback } from '../../services/api.service';
import '../../styles/components/ToastContainer.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Register toast callback with API service
    setToastCallback(({ type, message, details = [] }) => {
      const id = Date.now() + Math.random();
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

