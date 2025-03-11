import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

// Create the context
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { token } = useContext(AuthContext);
  const reconnectAttemptRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Function to create socket with error handling
  const createSocket = (url, options) => {
    try {
      return io(url, options);
    } catch (err) {
      console.error('Error creating socket:', err);
      setConnectionError('Failed to initialize socket connection');
      return null;
    }
  };

  useEffect(() => {
    let socketInstance = null;
    let reconnectTimer = null;

    // Initialize Socket connection when component mounts
    const connectSocket = () => {
      try {
        // Clear any previous error
        setConnectionError(null);
        
        // Attempt to connect to the backend API without using WebSockets first
        // This is a fallback mechanism
        fetch('/api/health')
          .then(response => {
            console.log('API health check response:', response.status);
          })
          .catch(err => {
            console.warn('API health check failed:', err);
          });
        
        // Get the host URL dynamically
        const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
        console.log('Attempting to connect to socket at:', apiUrl);
        
        // Create socket with more robust options
        const socketOptions = {
          transports: ['polling', 'websocket'], // Start with polling as it's more reliable
          reconnection: true,                   // Enable reconnection
          reconnectionAttempts: 10,             // Increase reconnection attempts
          reconnectionDelay: 1000,              // Start with 1s delay
          reconnectionDelayMax: 10000,          // Max 10s between reconnection attempts
          timeout: 30000,                       // Increase timeout to 30s (was 20s)
          forceNew: true,                       // Force a new connection
          query: token ? { token } : {},        // Send token in query if available
        };
        
        socketInstance = createSocket(apiUrl, socketOptions);
        
        if (!socketInstance) {
          throw new Error('Failed to create socket instance');
        }

        // Socket connection event handlers
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          setConnected(true);
          setConnectionError(null);
          reconnectAttemptRef.current = 0;
          
          // Authenticate the socket connection if token exists
          if (token) {
            socketInstance.emit('authenticate', { token });
          }
        });

        socketInstance.on('connect_error', (error) => {
          const errorMsg = error?.message || 'Connection error';
          console.error('Socket connection error:', errorMsg);
          setConnectionError(errorMsg);
          
          // If we're hitting timeouts repeatedly, try a different approach
          if (errorMsg.includes('timeout') && reconnectAttemptRef.current < maxReconnectAttempts) {
            reconnectAttemptRef.current += 1;
            console.log(`Reconnect attempt ${reconnectAttemptRef.current}/${maxReconnectAttempts}`);
            
            // Try to connect with different options on next attempt
            if (reconnectAttemptRef.current === 3) {
              console.log('Trying alternative connection method...');
              socketInstance.io.opts.transports = ['polling']; // Force polling only
            }
          } else if (reconnectAttemptRef.current >= maxReconnectAttempts) {
            // After max attempts, show a user-friendly message but keep the app working
            toast.warning("Live updates unavailable. Some features may be limited.");
            console.error('Max reconnection attempts reached');
          }
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected, reason:', reason);
        setConnected(false);
          
          // If the server forced the disconnect, try to reconnect
          if (reason === 'io server disconnect') {
            console.log('Server forced disconnect, attempting to reconnect...');
            socketInstance.connect();
          }
          
          // If transport close, try different transport on reconnect
          if (reason === 'transport close') {
            console.log('Transport closed, will try alternative on reconnect');
          }
        });

        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
          setConnectionError(`Socket error: ${error.message || 'Unknown error'}`);
        });

        // Set socket state
        setSocket(socketInstance);
        
        // Return cleanup function
        return () => {
          console.log('Cleaning up socket connection');
          if (socketInstance) {
            socketInstance.disconnect();
            socketInstance.removeAllListeners();
          }
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
          }
        };
      } catch (error) {
        console.error('Error in socket connection setup:', error);
        setConnectionError(error.message || 'Failed to setup socket connection');
      return () => {
          if (reconnectTimer) clearTimeout(reconnectTimer);
        };
      }
    };

    const cleanup = connectSocket();
    return cleanup;
  }, [token]);

  // Explicitly attempt to reconnect - can be called from UI
  const attemptReconnect = () => {
    if (socket) {
      console.log('Manually attempting to reconnect socket...');
      socket.connect();
    }
  };

  // Modified subscribeToEventUpdates to be more robust
  const subscribeToEventUpdates = (callback) => {
    if (!socket) return () => {}; // Return no-op if no socket
    
    const handleUpdate = (data) => {
      try {
        callback(data);
      } catch (err) {
        console.error('Error in event update callback:', err);
      }
    };
    
    socket.on('event-update', handleUpdate);
    
    // Return unsubscribe function
    return () => {
      socket.off('event-update', handleUpdate);
    };
  };

  // Join an event room to receive updates for a specific event
  const joinEvent = (eventId) => {
    if (socket && connected) {
      socket.emit('join-event', eventId);
      console.log(`Joined event room: ${eventId}`);
    } else {
      console.warn(`Cannot join event ${eventId}, socket not connected`);
    }
  };

  // Leave an event room
  const leaveEvent = (eventId) => {
    if (socket && connected) {
      socket.emit('leave-event', eventId);
      console.log(`Left event room: ${eventId}`);
    }
  };

  // Listen for trade updates
  const subscribeToTradeUpdates = (callback) => {
    if (socket) {
      socket.on('trade-update', (data) => {
        callback(data);
      });
    }
  };

  // Listen for odds updates
  const subscribeToOddsUpdates = (eventId, callback) => {
    if (socket) {
      socket.on('odds-update', (data) => {
        callback(data);
      });
    }
  };

  // Listen for notifications
  const subscribeToNotifications = (callback) => {
    if (socket) {
      socket.on('notification', (data) => {
        callback(data);
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        connectionError,
        joinEvent,
        leaveEvent,
        subscribeToEventUpdates,
        subscribeToTradeUpdates,
        subscribeToOddsUpdates,
        subscribeToNotifications,
        attemptReconnect
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}; 