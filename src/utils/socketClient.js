import io from "socket.io-client";

export let socket;

export function init() {
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
  });
}

export function isConnected() {
  return socket && socket.connected;
}
