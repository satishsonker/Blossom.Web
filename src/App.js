import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import LoadingProvider from './components/loading/LoadingProvider';
import ToastContainer from './components/toast/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import FileUpload from './pages/admin/FileUpload';
import MasterData from './pages/admin/MasterData';
import Settings from './pages/admin/Settings';
import './styles/App.css';

function App() {
  return (
    <ErrorBoundary
      message="Oops! Something went wrong"
      showDetails={true}
      showReload={true}
      showReset={true}
      logError={true}
      onError={(error, errorInfo, errorId) => {
        // Custom error handler - can send to logging service
        console.error('App Error:', { error, errorInfo, errorId });
      }}
    >
      <ThemeProvider>
        <ErrorBoundary message="Theme Error">
          <AuthProvider>
            <ErrorBoundary message="Authentication Error">
              <LoadingProvider>
                <ErrorBoundary message="Loading Error">
                  <Router>
                    <ErrorBoundary message="Routing Error">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PublicLayout />}>
                          <Route index element={<Home />} />
                          <Route path="about" element={<About />} />
                          <Route path="contact" element={<Contact />} />
                        </Route>

                        {/* Admin Routes - Protected */}
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="users" element={<Users />} />
                          <Route path="products" element={<Products />} />
                          <Route path="file-upload" element={<FileUpload />} />
                          <Route path="master-data" element={<MasterData />} />
                          <Route path="settings" element={<Settings />} />
                          <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>

                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </ErrorBoundary>
                  </Router>
                  <ToastContainer />
                </ErrorBoundary>
              </LoadingProvider>
            </ErrorBoundary>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

