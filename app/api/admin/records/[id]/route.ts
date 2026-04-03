import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { emitToUserRoom } from "@/lib/socketEmit";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireRole(["ADMIN"])(req as any);

    const body = await req.json();
    const { id } = await context.params;

    const nextType =
      body.type === "INCOME" || body.type === "EXPENSE"
        ? body.type
        : undefined;

    if (!nextType) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const updated = await prisma.financialRecord.update({
      where: { id },
      data: {
        amount: Number(body.amount),
        type: nextType,
        category: String(body.category ?? ""),
        note: body.note === "" || body.note == null ? null : String(body.note),
        date: new Date(body.date),
      },
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        note: true,
        date: true,
        userId: true,
        createdAt: true,
      },
    });

    await emitToUserRoom(
      updated.userId,
      "financial-update",
      updated,
    );

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

