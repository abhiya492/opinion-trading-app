import React, { useEffect, useRef, useState, memo } from 'react';

// Use memo to prevent unnecessary re-renders
const LoadingOverlay = memo(({ isLoading, message = 'Loading...' }) => {
  const prevLoadingRef = useRef(false);
  const timeoutRef = useRef(null);
  // Use local state for stable rendering
  const [shouldRender, setShouldRender] = useState(false);
  
  // Debounce the loading state changes to prevent flickering
  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // If loading is turning on, set it immediately
    if (isLoading && !shouldRender) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    }
    // If loading is turning off, delay a bit to avoid flicker
    else if (!isLoading && shouldRender) {
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'auto';
      }, 200); // Small delay to prevent flicker
    }
    
    // Safety timeout to force remove overlay after 10s
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        console.warn('LoadingOverlay safety timeout reached - forcing removal');
        setShouldRender(false);
        document.body.style.overflow = 'auto';
      }, 10000);
    }
    
    // Only log meaningful changes to reduce console spam
    if (prevLoadingRef.current !== isLoading) {
      console.log(`LoadingOverlay prop change: isLoading ${prevLoadingRef.current} -> ${isLoading}`);
      prevLoadingRef.current = isLoading;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.body.style.overflow = 'auto';
    };
  }, [isLoading, shouldRender]);

  // Don't render anything if not needed
  if (!shouldRender) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      data-testid="loading-overlay"
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all animate__animated animate__fadeIn">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{message}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Please wait while we prepare your content...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoadingOverlay; 