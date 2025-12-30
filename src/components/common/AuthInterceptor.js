import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { setLogoutCallback } from '../../services/api.service';

/**
 * Component that sets up the logout callback for API service
 * This allows the API service to logout the user when a 401 response is received
 */
const AuthInterceptor = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Set the logout callback that will be called when API returns 401
    setLogoutCallback(() => {
      logout();
    });

    // Cleanup: remove callback on unmount
    return () => {
      setLogoutCallback(null);
    };
  }, [logout]);

  return null; // This component doesn't render anything
};

export default AuthInterceptor;

