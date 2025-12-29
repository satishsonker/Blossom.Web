import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.service';
import API_ENDPOINTS from '../config/api.endpoints';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username, password, rememberMe = false) => {
    return await apiService.post(API_ENDPOINTS.AUTH.LOGIN, { username, password }, { showToast: false })
      .then(response => {
        var userData = getJwtClaims(response.data?.data?.token);
        if(userData?.roles && typeof userData.roles==='string'){ 
          userData.roles =JSON.parse(userData.roles);
        }
        setUser(userData);
        const tokenData = response.data?.data;
        localStorage.setItem('token', JSON.stringify(tokenData));
        
        // If remember me is checked, set expiration to 30 days
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          localStorage.setItem('tokenExpiration', expirationDate.toISOString());
        } else {
          localStorage.removeItem('tokenExpiration');
        }
        
        return { success: true, user: userData };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Login failed' };
      });
  };

  const signup = async (userData) => {
    return await apiService.post(API_ENDPOINTS.USERS.REGISTER, userData)
      .then(response => {
        return { success: true, message: response.data?.message || 'Registration successful' };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Registration failed' };
      });
  };

  const googleLogin = async (googleToken) => {
    return await apiService.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: googleToken }, { showToast: false })
      .then(response => {
        var userData = getJwtClaims(response.data?.data?.token);
        if(userData?.roles && typeof userData.roles==='string'){ 
          userData.roles =JSON.parse(userData.roles);
        }
        setUser(userData);
        localStorage.setItem('token', JSON.stringify(response.data?.data));
        return { success: true, user: userData };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Google login failed' };
      });
  };

  const forgotPassword = async (email) => {
    return await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      .then(response => {
        return { success: true, message: response.data?.message || 'Password reset email sent' };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Failed to send reset email' };
      });
  };

  const resetPassword = async (token, newPassword) => {
    return await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword })
      .then(response => {
        return { success: true, message: response.data?.message || 'Password reset successful' };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Password reset failed' };
      });
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, { 
      currentPassword, 
      newPassword 
    })
      .then(response => {
        return { success: true, message: response.data?.message || 'Password changed successfully' };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Password change failed' };
      });
  };

  const getJwtClaims = (token) => {
    const payload = token.split('.')[1]; // second part
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  };

  const isAdmin = () => {
    if (!user) return false;
    // Check if user has role property (string)
    if (user.role === 'admin') return true;
    // Check if user has roles array with ADMIN RoleCode
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(role => role.RoleCode === 'ADMIN' || role.roleCode === 'ADMIN' || role === 'ADMIN');
    }
    return false;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      googleLogin,
      forgotPassword,
      resetPassword,
      changePassword,
      logout, 
      isAdmin, 
      getToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

