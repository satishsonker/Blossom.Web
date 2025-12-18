import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import Inputbox from '../../common/Inputbox';
import '../../../styles/components/auth/AuthPopup.css';

export default function ResetPasswordPopup({ setShowResetPasswordModal, onSwitchToLogin }) {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [form, setForm] = useState({ 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const resetToken = token || form.token;
    if (!resetToken) {
      setError('Reset token is missing');
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(resetToken, form.password);
    setIsLoading(false);

    if (result?.success) {
      setSuccess(true);
    } else {
      setError(result?.error || 'Password reset failed');
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
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
            <h2>Password Reset Successful</h2>
            <p className="auth-subtitle">Your password has been changed successfully</p>
          </div>

          <div className="auth-footer">
            <button
              type="button"
              className="auth-primary-btn"
              onClick={() => {
                setShowResetPasswordModal(false);
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter your new password</p>
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

          {!token && (
            <div className="form-group">
              <Inputbox
                type="text"
                name="token"
                value={form.token || ''}
                isRequired={true}
                onChangeHandler={handleChange}
                labelText="Reset Token"
                placeholder="Enter reset token from email"
              />
            </div>
          )}

          <div className="form-group">
            <Inputbox
              type="password"
              name="password"
              value={form.password}
              isRequired={true}
              onChangeHandler={handleChange}
              labelText="New Password"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <Inputbox
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              isRequired={true}
              onChangeHandler={handleChange}
              labelText="Confirm New Password"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => {
              setShowResetPasswordModal(false);
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

