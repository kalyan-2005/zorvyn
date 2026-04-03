import { io } from "socket.io-client";

function socketUrl(): string {
  const full = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (full) return full;

  const port = process.env.NEXT_PUBLIC_SOCKET_PORT ?? "4000";
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
  }
  return `http://localhost:${port}`;
}

export const socket = io(socketUrl(), {
  autoConnect: false,
  transports: ["websocket", "polling"],
});
