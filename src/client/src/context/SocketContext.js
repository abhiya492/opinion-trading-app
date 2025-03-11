import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Initialize Socket connection when component mounts
    const socketInit = () => {
      const newSocket = io('/', {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        
        // Authenticate the socket connection
        if (token) {
          newSocket.emit('authenticate', token);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      setSocket(newSocket);

      // Cleanup when component unmounts
      return () => {
        newSocket.disconnect();
      };
    };

    const socketConnection = socketInit();

    // Clean up on unmount
    return () => {
      if (socketConnection) {
        socketConnection();
      }
    };
  }, [token]);

  // Join an event room to receive updates for a specific event
  const joinEvent = (eventId) => {
    if (socket && connected) {
      socket.emit('join-event', eventId);
    }
  };

  // Leave an event room
  const leaveEvent = (eventId) => {
    if (socket && connected) {
      socket.emit('leave-event', eventId);
    }
  };

  // Listen for event updates
  const subscribeToEventUpdates = (eventId, callback) => {
    if (socket) {
      socket.on('event-update', (data) => {
        if (data.event._id === eventId) {
          callback(data);
        }
      });
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
        joinEvent,
        leaveEvent,
        subscribeToEventUpdates,
        subscribeToTradeUpdates,
        subscribeToOddsUpdates,
        subscribeToNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;

 