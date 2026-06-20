// A single shared Socket.io connection for the notifications namespace.
// Exported as functions (not a class instance you new-up per component) so
// every part of the app reuses the SAME socket — this is what prevents the
// "stale room" bug where a user ends up subscribed to more than one
// user:<id> room at once.

import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ??
  'http://localhost:3000';

let socket: Socket | null = null;
let joinedUserId: string | null = null;

/**
 * 
 * Safe to call multiple times — it will only create one underlying socket,
 * and will properly leave the previous room if the userId changes
 * (e.g. on logout/login as a different account in the same tab).
 */
export function connectNotificationSocket(userId: string): Socket {
  if (!socket) {
    socket = io(`${SOCKET_URL}/notifications`, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }

  const join = () => {
    if (joinedUserId !== userId) {
      socket?.emit('join', { userId });
      joinedUserId = userId;
    }
  };

  if (socket.connected) {
    join();
  } else {
    socket.once('connect', join);
  }

  return socket;
}

/** Fully tear down the socket — call this on logout. */
export function disconnectNotificationSocket(): void {
  socket?.disconnect();
  socket = null;
  joinedUserId = null;
}

export function getNotificationSocket(): Socket | null {
  return socket;
}