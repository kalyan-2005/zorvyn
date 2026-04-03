import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { Server } from "socket.io";

const globalForSocket = globalThis as typeof globalThis & {
  __zorvynIo?: Server;
};

function getPort(): number {
  const raw =
    process.env.PORT ?? process.env.SOCKET_PORT ?? process.env.NEXT_PUBLIC_SOCKET_PORT;
  if (raw) {
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n)) return n;
  }
  return 4000;
}

function shouldListen(): boolean {
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  // Vercel and similar: no in-process socket listener; use HTTP bridge instead.
  if (process.env.VERCEL === "1") return false;
  return true;
}

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function handleInternalEmit(
  req: IncomingMessage,
  res: ServerResponse,
  io: Server
): void {
  const expected = process.env.SOCKET_EMIT_SECRET;
  const auth = req.headers.authorization;
  if (!expected || auth !== `Bearer ${expected}`) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "unauthorized" }));
    return;
  }

  void (async () => {
    try {
      const raw = await parseBody(req);
      const body = JSON.parse(raw) as {
        userId?: string;
        event?: string;
        payload?: unknown;
      };
      const { userId, event, payload } = body;
      if (!userId || !event) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "userId and event are required" }));
        return;
      }
      io.to(userId).emit(event, payload);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "invalid body" }));
    }
  })();
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

  // Render (and some PaaS port detectors) validate a web service by making
  // an HTTP request. Provide a minimal response so the service is detected.
  httpServer.prependListener("request", (req, res) => {
    const urlPath = (req.url ?? "").split("?")[0];
    if (req.method === "GET" && (urlPath === "/" || urlPath === "/health")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("ok");
    }
  });

  httpServer.prependListener("request", (req, res) => {
    const url = req.url ?? "";
    if (req.method === "POST" && url.split("?")[0] === "/internal/emit") {
      handleInternalEmit(req, res, io);
    }
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
  console.log(
    `Socket server selected port=${port} (env PORT=${process.env.PORT ?? "unset"}, SOCKET_PORT=${process.env.SOCKET_PORT ?? "unset"}, NEXT_PUBLIC_SOCKET_PORT=${process.env.NEXT_PUBLIC_SOCKET_PORT ?? "unset"})`
  );
  if (shouldListen()) {
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`Socket server listening on port ${port}`);
    });
  }

  globalForSocket.__zorvynIo = io;
  return io;
}

export const io = createIo();
