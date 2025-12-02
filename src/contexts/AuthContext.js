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

  const login = async (username, password) => {
    return await apiService.post(API_ENDPOINTS.AUTH.LOGIN, { username, password })
      .then(response => {
        var userData = getJwtClaims(response.data?.data?.token);
        setUser(userData);
        localStorage.setItem('token', JSON.stringify(response.data?.data));
        return { success: true, user: userData };
      })
      .catch(error => {
        return { success: false, error: error.response?.data?.message || 'Login failed' };
      });
  };

  const getJwtClaims = (token) => {
    const payload = token.split('.')[1]; // second part
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  }

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const getToken = () => {
    return localStorage.getItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

