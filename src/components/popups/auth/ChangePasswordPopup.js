import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Inputbox from '../../common/Inputbox';
import '../../../styles/components/auth/AuthPopup.css';

const ChangePasswordPopup = ({ setShowChangePasswordModal }) => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ 
    currentPassword: '', 
    newPassword: '', 
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

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError('New password must be different from current password');
      setIsLoading(false);
      return;
    }

    const result = await changePassword(form.currentPassword, form.newPassword);
    setIsLoading(false);

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        setShowChangePasswordModal(false);
      }, 2000);
    } else {
      setError(result?.error || 'Password change failed');
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
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
            <h2>Password Changed</h2>
            <p className="auth-subtitle">Your password has been changed successfully</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Change Password</h2>
          <p className="auth-subtitle">Update your account password</p>
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
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              isRequired={true}
              onChangeHandler={handleChange}
              labelText="Current Password"
              placeholder="Enter your current password"
            />
          </div>

          <div className="form-group">
            <Inputbox
              type="password"
              name="newPassword"
              value={form.newPassword}
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

          <div className="form-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => setShowChangePasswordModal(false)}
              style={{
                flex: 1,
                padding: '0.875rem 1.5rem',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="auth-primary-btn"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;

