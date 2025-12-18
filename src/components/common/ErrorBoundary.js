import React, { Component } from 'react';
import '../../styles/ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }

    // Log to error reporting service if configured
    if (this.props.logError) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Example: Send to error reporting service
    // You can integrate with services like Sentry, LogRocket, etc.
    try {
      const errorData = {
        errorId: this.state.errorId,
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example: Send to your backend
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData),
      // });

      console.log('Error logged:', errorData);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Navigate to home if navigate prop is provided
    if (this.props.resetToHome) {
      window.location.href = '/';
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Use custom render function if provided
      if (this.props.render) {
        return this.props.render(this.state.error, this.state.errorInfo, this.handleReset);
      }

      // Default error UI
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onReset={this.handleReset}
          onReload={this.handleReload}
          message={this.props.message}
          showDetails={this.props.showDetails !== false}
          showReload={this.props.showReload !== false}
          showReset={this.props.showReset !== false}
          resetLabel={this.props.resetLabel}
          reloadLabel={this.props.reloadLabel}
        />
      );
    }

    return this.props.children;
  }
}

// Fallback UI Component
const ErrorBoundaryFallback = ({
  error,
  errorInfo,
  errorId,
  onReset,
  onReload,
  message,
  showDetails,
  showReload,
  showReset,
  resetLabel = 'Try Again',
  reloadLabel = 'Reload Page',
}) => {

  const defaultMessage = message || 'Something went wrong!';
  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorStack = error?.stack || '';
  const componentStack = errorInfo?.componentStack || '';

  return (
    <div className="error-boundary">
      <div className="error-boundary-container">
        <div className="error-boundary-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="error-boundary-title">{defaultMessage}</h1>
        
        <p className="error-boundary-description">
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>

        {errorId && (
          <div className="error-boundary-id">
            <span className="error-id-label">Error ID:</span>
            <code className="error-id-value">{errorId}</code>
          </div>
        )}

        {showDetails && (errorMessage || errorStack || componentStack) && (
          <details className="error-boundary-details">
            <summary className="error-details-summary">Technical Details</summary>
            <div className="error-details-content">
              {errorMessage && (
                <div className="error-detail-section">
                  <strong>Error Message:</strong>
                  <pre className="error-pre">{errorMessage}</pre>
                </div>
              )}
              {errorStack && (
                <div className="error-detail-section">
                  <strong>Stack Trace:</strong>
                  <pre className="error-pre">{errorStack}</pre>
                </div>
              )}
              {componentStack && (
                <div className="error-detail-section">
                  <strong>Component Stack:</strong>
                  <pre className="error-pre">{componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="error-boundary-actions">
          {showReset && (
            <button
              className="error-boundary-btn error-boundary-btn-primary"
              onClick={onReset}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 16H3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {resetLabel}
            </button>
          )}
          
          {showReload && (
            <button
              className="error-boundary-btn error-boundary-btn-secondary"
              onClick={onReload}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {reloadLabel}
            </button>
          )}

          <button
            className="error-boundary-btn error-boundary-btn-tertiary"
            onClick={() => (window.location.href = '/')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

