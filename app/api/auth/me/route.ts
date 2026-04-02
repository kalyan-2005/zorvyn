import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user: any = requireRole(["ADMIN", "VIEWER", "ANALYST"])(req as any);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unauthorized" },
      { status: 401 },
    );
  }
}
