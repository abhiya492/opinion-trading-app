import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { startLoading, stopLoading } = useLoading();
  
  useEffect(() => {
    if (!loading && user) {
      startLoading('Loading your content...');
      
      // Simulate a delay for the loading animation
      const timer = setTimeout(() => {
        stopLoading();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, startLoading, stopLoading]);
  
  if (loading) {
    return null; // Render nothing while auth state is loading
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute; 