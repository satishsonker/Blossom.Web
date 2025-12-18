/**
 * ErrorBoundary Usage Examples
 * 
 * The ErrorBoundary component provides flexible error handling with dynamic messages.
 * Here are various ways to use it:
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Example 1: Basic Usage with Default UI
export const BasicExample = () => {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 2: Custom Error Message
export const CustomMessageExample = () => {
  return (
    <ErrorBoundary message="Oops! Something went wrong with this section">
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 3: Hide Technical Details
export const SimpleErrorExample = () => {
  return (
    <ErrorBoundary
      message="Something went wrong"
      showDetails={false}
      showReload={false}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 4: Custom Error Handler
export const WithErrorHandlerExample = () => {
  return (
    <ErrorBoundary
      message="An error occurred"
      onError={(error, errorInfo, errorId) => {
        // Send to error tracking service (e.g., Sentry, LogRocket)
        console.error('Error caught:', { error, errorInfo, errorId });
        
        // Example: Send to your backend
        // fetch('/api/errors', {
        //   method: 'POST',
        //   body: JSON.stringify({ error, errorInfo, errorId })
        // });
      }}
      logError={true}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 5: Custom Fallback UI
export const CustomFallbackExample = () => {
  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Custom Error UI</h2>
          <p>{error?.message || 'An error occurred'}</p>
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 6: Custom Render Function
export const CustomRenderExample = () => {
  return (
    <ErrorBoundary
      render={(error, errorInfo, resetError) => (
        <div className="custom-error">
          <h1>Error: {error?.message}</h1>
          <details>
            <summary>Stack Trace</summary>
            <pre>{error?.stack}</pre>
          </details>
          <button onClick={resetError}>Reset</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 7: Nested Error Boundaries (Isolate Errors)
export const NestedExample = () => {
  return (
    <ErrorBoundary message="App-level error">
      <Header />
      <ErrorBoundary message="Content error">
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary message="Sidebar error">
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary message="Footer error">
        <Footer />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

// Example 8: With Reset Navigation
export const WithResetNavigationExample = () => {
  return (
    <ErrorBoundary
      message="Page Error"
      resetToHome={true}
      onReset={() => {
        // Custom reset logic
        console.log('Resetting...');
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 9: Custom Button Labels
export const CustomLabelsExample = () => {
  return (
    <ErrorBoundary
      message="Error occurred"
      resetLabel="Retry"
      reloadLabel="Refresh"
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

// Example 10: Minimal Error Boundary (No buttons, just message)
export const MinimalExample = () => {
  return (
    <ErrorBoundary
      message="Error"
      showDetails={false}
      showReload={false}
      showReset={false}
    >
      <YourComponent />
    </ErrorBoundary>
  );
};

/**
 * Props API:
 * 
 * - message: string - Custom error message (default: "Something went wrong!")
 * - showDetails: boolean - Show technical details (default: true)
 * - showReload: boolean - Show reload button (default: true)
 * - showReset: boolean - Show reset button (default: true)
 * - resetLabel: string - Label for reset button (default: "Try Again")
 * - reloadLabel: string - Label for reload button (default: "Reload Page")
 * - resetToHome: boolean - Navigate to home on reset (default: false)
 * - logError: boolean - Enable error logging (default: false)
 * - onError: function(error, errorInfo, errorId) - Custom error handler
 * - onReset: function() - Custom reset handler
 * - fallback: function(error, resetError) - Custom fallback UI component
 * - render: function(error, errorInfo, resetError) - Custom render function
 */

