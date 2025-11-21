import React, { useEffect, useState } from 'react';
import '../../styles/components/Toast.css';

const Toast = ({ type = 'success', message = '', details = [], onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="toast-icon success-icon">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="toast-icon error-icon">
            <svg className="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="toast-icon warning-icon">
            <svg className="warningmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <path className="warningmark-path" fill="none" d="M26 8 L44 40 L8 40 Z" />
              <path className="warningmark-exclamation" fill="none" d="M26 20 L26 28 M26 32 L26 32" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`toast-container ${type} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-content">
        {getIcon()}
        <div className="toast-message">
          <div className="toast-title">{message}</div>
          {details && details.length > 0 && (
            <div className="toast-details">
              {details.map((detail, index) => (
                <div key={index} className="toast-detail-item">
                  {detail}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="toast-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

