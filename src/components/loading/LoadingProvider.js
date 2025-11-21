import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import { addLoadingCallback, removeLoadingCallback } from '../../services/api.service';
import '../../styles/components/LoadingProvider.css';

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoadingChange = (loading) => {
      setIsLoading(loading);
    };

    addLoadingCallback(handleLoadingChange);

    return () => {
      removeLoadingCallback(handleLoadingChange);
    };
  }, []);

  return (
    <>
      {children}
      {isLoading && <Loading message="Processing your request..." />}
    </>
  );
};

export default LoadingProvider;

