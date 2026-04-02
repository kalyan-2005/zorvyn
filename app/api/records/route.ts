import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user: any = requireRole(["ADMIN", "VIEWER", "ANALYST"])(req as any);

    const records = await prisma.financialRecord.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(records);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = requireRole(["ADMIN", "VIEWER", "ANALYST"])(req as any);

    const body = await req.json();

    const record = await prisma.financialRecord.create({
      data: {
        amount: body.amount,
        type: body.type,
        category: body.category,
        note: body.note,
        date: new Date(body.date),
        userId: user.id,
      },
    });

    return NextResponse.json(record);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}