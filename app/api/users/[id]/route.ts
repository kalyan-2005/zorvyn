import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(["ADMIN"])(req as any);
    const body = await req.json();
    const { id } = await context.params;
    const { role, status } = body;

    if (!role && !status) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}