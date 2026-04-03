import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user: any = requireRole(["ADMIN", "VIEWER", "ANALYST"])(req as any);

    const income = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME", userId: user.id },
    });

    const expense = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE", userId: user.id },
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    return NextResponse.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      userId: user.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}