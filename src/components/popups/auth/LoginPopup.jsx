import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Inputbox from '../../common/Inputbox';
import '../../../styles/components/auth/AuthPopup.css';

export default function LoginPopup({ setShowLoginModal, onSwitchToSignup, onSwitchToForgotPassword, isOpen = true }) {
  const { login, googleLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    const result = await googleLogin(response.credential);
    setIsLoading(false);

    if (result?.success) {
      setShowLoginModal(false);
      if (isAdmin()) {
        navigate('/admin/dashboard');
      }
    } else {
      setLoginError(result?.error || 'Google login failed');
    }
  };

  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCallback,
          });

          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
            });
          }
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setLoginError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(loginForm.email, loginForm.password, rememberMe);
    setIsLoading(false);

    if (result?.success) {
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      if (isAdmin()) {
        navigate('/admin/dashboard');
      }
    } else {
      setLoginError(result?.error || 'Login failed');
    }
  };

  const modalContent = (
    <div className="auth-modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {loginError && (
            <div className="auth-error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <div className="form-group">
            <Inputbox
              type="email"
              name="email"
              value={loginForm.email}
              isRequired={true}
              onChangeHandler={handleTextChange}
              labelText="Email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <Inputbox
              type="password"
              name="password"
              value={loginForm.password}
              isRequired={true}
              onChangeHandler={handleTextChange}
              labelText="Password"
              placeholder="Enter your password"
            />
          </div>

          <div className="auth-form-options">
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me for 30 days</span>
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => {
                setShowLoginModal(false);
                if (onSwitchToForgotPassword) onSwitchToForgotPassword();
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        {process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== '' && (
          <div className="auth-social-login">
            <div id="google-signin-button" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setShowLoginModal(false);
                if (onSwitchToSignup) onSwitchToSignup();
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
