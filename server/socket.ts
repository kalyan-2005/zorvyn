import { createServer } from "http";
import { Server } from "socket.io";

const globalForSocket = globalThis as typeof globalThis & {
  __zorvynIo?: Server;
};

function getPort(): number {
  const raw = process.env.SOCKET_PORT ?? process.env.NEXT_PUBLIC_SOCKET_PORT;
  if (raw) {
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n)) return n;
  }
  return 4000;
}

function createIo(): Server {
  if (globalForSocket.__zorvynIo) {
    return globalForSocket.__zorvynIo;
  }

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-user-room", (userId: string) => {
      socket.join(userId);
      console.log(`Joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  const port = getPort();
  // next build imports route modules in many workers; instrumentation register() is skipped
  // during phase-production-build, but this module still loads — never bind a port then.
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    httpServer.listen(port, () => {
      console.log(`Socket server listening on port ${port}`);
    });
  }

  globalForSocket.__zorvynIo = io;
  return io;
}

export const io = createIo();
