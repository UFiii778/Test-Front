// =====================================================
// FILE: frontend/src/contexts/SocketContext.jsx
// DESKRIPSI: Socket context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

// Create context
const SocketContext = createContext(null);

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Provider component
export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated(), user]);

  // Connect to socket
  const connect = () => {
    socketService.connect();
    setupListeners();
  };

  // Disconnect from socket
  const disconnect = () => {
    socketService.disconnect();
    setConnected(false);
    setOnlineUsers([]);
    setTypingUsers({});
  };

  // Setup socket listeners
  const setupListeners = () => {
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('user:connected', handleUserConnected);
    socketService.on('user:disconnected', handleUserDisconnected);
    socketService.on('typing:start', handleTypingStart);
    socketService.on('typing:stop', handleTypingStop);
    socketService.on('presence:online-users', handleOnlineUsers);
  };

  // Cleanup listeners
  const cleanupListeners = () => {
    socketService.off('connect', handleConnect);
    socketService.off('disconnect', handleDisconnect);
    socketService.off('user:connected', handleUserConnected);
    socketService.off('user:disconnected', handleUserDisconnected);
    socketService.off('typing:start', handleTypingStart);
    socketService.off('typing:stop', handleTypingStop);
    socketService.off('presence:online-users', handleOnlineUsers);
  };

  // Handle connect
  const handleConnect = () => {
    setConnected(true);
    console.log('Socket connected');
  };

  // Handle disconnect
  const handleDisconnect = (reason) => {
    setConnected(false);
    console.log('Socket disconnected:', reason);
  };

  // Handle user connected
  const handleUserConnected = (data) => {
    setOnlineUsers(prev => [...prev, data.userId]);
  };

  // Handle user disconnected
  const handleUserDisconnected = (data) => {
    setOnlineUsers(prev => prev.filter(id => id !== data.userId));
  };

  // Handle typing start
  const handleTypingStart = (data) => {
    setTypingUsers(prev => ({
      ...prev,
      [data.from]: true
    }));

    // Auto clear after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => {
        const newState = { ...prev };
        delete newState[data.from];
        return newState;
      });
    }, 3000);
  };

  // Handle typing stop
  const handleTypingStop = (data) => {
    setTypingUsers(prev => {
      const newState = { ...prev };
      delete newState[data.from];
      return newState;
    });
  };

  // Handle online users
  const handleOnlineUsers = (users) => {
    setOnlineUsers(users);
  };

  // Emit event
  const emit = useCallback((event, data) => {
    return socketService.emit(event, data);
  }, []);

  // Join room
  const joinRoom = useCallback((roomId) => {
    return socketService.joinRoom(roomId);
  }, []);

  // Leave room
  const leaveRoom = useCallback((roomId) => {
    return socketService.leaveRoom(roomId);
  }, []);

  // Send private message
  const sendPrivateMessage = useCallback((to, message, type = 'text') => {
    return socketService.sendPrivateMessage(to, message, type);
  }, []);

  // Send room message
  const sendRoomMessage = useCallback((roomId, message, type = 'text') => {
    return socketService.sendRoomMessage(roomId, message, type);
  }, []);

  // Start typing
  const startTyping = useCallback((to) => {
    return socketService.startTyping(to);
  }, []);

  // Stop typing
  const stopTyping = useCallback((to) => {
    return socketService.stopTyping(to);
  }, []);

  // Update location
  const updateLocation = useCallback((latitude, longitude) => {
    return socketService.updateLocation(latitude, longitude);
  }, []);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  // Check if user is typing
  const isUserTyping = useCallback((userId) => {
    return !!typingUsers[userId];
  }, [typingUsers]);

  // Get socket ID
  const getSocketId = useCallback(() => {
    return socketService.getSocketId();
  }, []);

  // Context value
  const value = {
    connected,
    onlineUsers,
    typingUsers,
    emit,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    sendRoomMessage,
    startTyping,
    stopTyping,
    updateLocation,
    isUserOnline,
    isUserTyping,
    getSocketId
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};