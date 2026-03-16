// =====================================================
// FILE: frontend/src/hooks/useSocket.js
// DESKRIPSI: Socket hook
// =====================================================

import { useContext, useEffect, useCallback, useRef } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

// Convenience hooks
export const useSocketEvent = (event, handler) => {
  const { on, off } = useSocket();
  
  useEffect(() => {
    on(event, handler);
    return () => off(event, handler);
  }, [event, handler, on, off]);
};

export const useSocketEmit = () => {
  const { emit } = useSocket();
  return emit;
};

export const useSocketConnected = () => {
  const { connected } = useSocket();
  return connected;
};

export const useOnlineUsers = () => {
  const { onlineUsers } = useSocket();
  return onlineUsers;
};

export const useTypingUsers = () => {
  const { typingUsers } = useSocket();
  return typingUsers;
};

export const useIsUserOnline = (userId) => {
  const { isUserOnline } = useSocket();
  return isUserOnline(userId);
};

export const useIsUserTyping = (userId) => {
  const { isUserTyping } = useSocket();
  return isUserTyping(userId);
};

export const useTypingIndicator = (userId) => {
  const { startTyping, stopTyping } = useSocket();
  const timeoutRef = useRef();

  const handleTyping = useCallback(() => {
    startTyping(userId);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      stopTyping(userId);
    }, 3000);
  }, [userId, startTyping, stopTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        stopTyping(userId);
      }
    };
  }, [userId, stopTyping]);

  return handleTyping;
};