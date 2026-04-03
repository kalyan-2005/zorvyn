export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // No in-process socket on Vercel; Render (or similar) runs the socket service separately.
  if (process.env.VERCEL === "1") return;
  await import("./server/socket");
}
