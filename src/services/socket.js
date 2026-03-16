import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

const socketService = {
  connect: (token) => {
    if (socket?.connected) return socket;
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    return socket;
  },
  disconnect: () => { socket?.disconnect(); socket = null; },
  getSocket: () => socket,
  on: (event, cb) => socket?.on(event, cb),
  off: (event, cb) => socket?.off(event, cb),
  emit: (event, data) => socket?.emit(event, data),
};

export default socketService;
