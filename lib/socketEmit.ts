/**
 * Emits Socket.IO events to a user room. On Vercel (or any host without an
 * in-process socket server), set SOCKET_SERVER_URL + SOCKET_EMIT_SECRET so
 * events go through the HTTP bridge on your Render socket service.
 */
export async function emitToUserRoom(
  userId: string,
  event: string,
  payload: unknown
): Promise<void> {
  const base = process.env.SOCKET_SERVER_URL?.replace(/\/$/, "");
  const secret = process.env.SOCKET_EMIT_SECRET;

  if (base && secret) {
    const res = await fetch(`${base}/internal/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ userId, event, payload }),
    });
    if (!res.ok) {
      console.error(
        "socket emit bridge failed:",
        res.status,
        await res.text().catch(() => "")
      );
    }
    return;
  }

  const { io } = await import("@/server/socket");
  io.to(userId).emit(event, payload);
}
