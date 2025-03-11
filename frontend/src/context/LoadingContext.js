import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

// Create Context
const LoadingContext = createContext();

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Provider Component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const timeoutRef = useRef(null);
  const loadingSourceRef = useRef('');
  const debounceTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const loadingRequestQueue = useRef([]);
  
  // Cleanup all timeouts on unmount
  useEffect(() => {
    // If the app is refreshed or closed, ensure we clean up
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Handle debounced loading state updates to prevent flicker
  const debouncedSetLoading = (value, msg = null, source = '') => {
    // If we're already updating, queue this request
    if (isUpdatingRef.current) {
      loadingRequestQueue.current.push({value, msg, source});
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set flag to indicate we're updating
    isUpdatingRef.current = true;
    
    // Debounce the actual state update to prevent rapid toggling
    debounceTimerRef.current = setTimeout(() => {
      // Only update if the value is different from current state to avoid re-renders
      if (value !== isLoading) {
        setIsLoading(value);
        if (msg && value) {
          setMessage(msg);
        } else if (!value) {
          setMessage('Loading...');
        }
      }
      
      // Handle any queued requests
      isUpdatingRef.current = false;
      if (loadingRequestQueue.current.length > 0) {
        const nextRequest = loadingRequestQueue.current.shift();
        debouncedSetLoading(nextRequest.value, nextRequest.msg, nextRequest.source);
      }
    }, 100); // 100ms debounce
  };
  
  // Also add a regular interval to check for stuck loading states
  useEffect(() => {
    const checkStuckLoading = setInterval(() => {
      if (isLoading && Date.now() - loadingSourceRef.current > 10000) {
        // If loading has been active for more than 10 seconds, force clear it
        console.warn('Detected stuck loading state, clearing automatically');
        _forceStopLoading();
      }
    }, 5000);
    
    return () => {
      clearInterval(checkStuckLoading);
    };
  }, [isLoading]);
  
  // Start loading with optional custom message
  const startLoading = (customMessage, source = '') => {
    // If we're already loading, don't toggle it
    if (isLoading) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    loadingSourceRef.current = source || Date.now().toString();
    
    // Use debounced set loading
    debouncedSetLoading(true, customMessage, source);
    
    // Safety timeout - never show loading for more than 10 seconds
    timeoutRef.current = setTimeout(() => {
      console.warn('Loading timeout reached, auto-clearing');
      _stopLoading();
    }, 10000);
  };
  
  // Internal stop loading implementation
  const _stopLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    loadingSourceRef.current = '';
    debouncedSetLoading(false);
  };
  
  // Public stop loading API
  const stopLoading = () => {
    _stopLoading();
  };
  
  // Internal force stop implementation
  const _forceStopLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Clear any queued loading requests
    loadingRequestQueue.current = [];
    isUpdatingRef.current = false;
    
    // Immediately reset all loading state
    setIsLoading(false);
    setMessage('Loading...');
    loadingSourceRef.current = '';
    
    // We also force the document body style to be scrollable
    document.body.style.overflow = 'auto';
  };
  
  // Public force stop loading API
  const forceStopLoading = () => {
    _forceStopLoading();
  };
  
  // Simulate a loading delay (useful for testing or for minimum loading time)
  const simulateLoading = async (customMessage, minTime = 800, source = '') => {
    // Safety check - if we're already loading, don't stack another one
    if (isLoading) {
      console.warn('Tried to start loading while already loading. Ignoring.');
      return;
    }
    
    startLoading(customMessage, source);
    
    // Set a new timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      stopLoading();
      timeoutRef.current = null;
    }, minTime);
  };
  
  // For debugging - get the current loading state
  const getLoadingState = () => {
    return {
      isLoading,
      message,
      source: loadingSourceRef.current,
      hasActiveTimeout: !!timeoutRef.current,
      queuedRequests: loadingRequestQueue.current.length
    };
  };
  
  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      startLoading, 
      stopLoading, 
      simulateLoading,
      forceStopLoading,
      getLoadingState
    }}>
      <LoadingOverlay isLoading={isLoading} message={message} />
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext; 