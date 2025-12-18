import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Inputbox from '../../common/Inputbox';
import '../../../styles/components/auth/AuthPopup.css';

export default function SignupPopup({ setShowSignupModal, onSwitchToLogin, onSwitchToGoogleSignup }) {
  const { signup, googleLogin, isAdmin } = useAuth();
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    const result = await googleLogin(response.credential);
    setIsLoading(false);

    if (result?.success) {
      setShowSignupModal(false);
    } else {
      setSignupError(result?.error || 'Google signup failed');
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

          const buttonContainer = document.getElementById('google-signup-button');
          if (buttonContainer) {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signup_with',
            });
          }
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    setSignupError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);

    // Validation
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setSignupError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const result = await signup({
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
    });

    setIsLoading(false);

    if (result?.success) {
      alert(result.message || 'Registration successful! Please login.');
      setShowSignupModal(false);
      if (onSwitchToLogin) onSwitchToLogin();
    } else {
      setSignupError(result?.error || 'Registration failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          {signupError && (
            <div className="auth-error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{signupError}</span>
            </div>
          )}

          <div className="form-group">
            <Inputbox
              type="text"
              name="name"
              value={signupForm.name}
              isRequired={true}
              onChangeHandler={handleTextChange}
              labelText="Full Name"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <Inputbox
              type="email"
              name="email"
              value={signupForm.email}
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
              value={signupForm.password}
              isRequired={true}
              onChangeHandler={handleTextChange}
              labelText="Password"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <Inputbox
              type="password"
              name="confirmPassword"
              value={signupForm.confirmPassword}
              isRequired={true}
              onChangeHandler={handleTextChange}
              labelText="Confirm Password"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        {process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== '' && (
          <div className="auth-social-login">
            <div id="google-signup-button" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setShowSignupModal(false);
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

