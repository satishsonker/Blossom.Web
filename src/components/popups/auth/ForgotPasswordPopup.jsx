import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Inputbox from '../../common/Inputbox';
import '../../../styles/components/auth/AuthPopup.css';

export default function ForgotPasswordPopup({ setShowForgotPasswordModal, onSwitchToLogin }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result?.success) {
      setSuccess(true);
    } else {
      setError(result?.error || 'Failed to send reset email');
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={() => setShowForgotPasswordModal(false)}>
        <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal-header">
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(34, 197, 94, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Check Your Email</h2>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="auth-footer">
            <button
              type="button"
              className="auth-primary-btn"
              onClick={() => {
                setShowForgotPasswordModal(false);
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setShowForgotPasswordModal(false)}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Forgot Password</h2>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <Inputbox
              type="email"
              name="email"
              value={email}
              isRequired={true}
              onChangeHandler={handleEmailChange}
              labelText="Email"
              placeholder="Enter your email address"
            />
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => {
              setShowForgotPasswordModal(false);
              if (onSwitchToLogin) onSwitchToLogin();
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

