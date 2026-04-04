import { prisma } from "@/lib/prisma";
import { emitToUserRoom } from "@/lib/socketEmit";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

function parseMonth(month: string | null): { start: Date; end: Date } | null {
  if (!month) return null;
  // expected: YYYY-MM from <input type="month" />
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex0 = Number(match[2]) - 1; // 0-11
  if (!Number.isFinite(year) || monthIndex0 < 0 || monthIndex0 > 11) return null;

  // Use UTC boundaries to avoid timezone shifting.
  const start = new Date(Date.UTC(year, monthIndex0, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex0 + 1, 1, 0, 0, 0));
  return { start, end };
}

export async function GET(req: Request) {
  try {
    const user: any = requireRole(["ADMIN", "VIEWER", "ANALYST"])(req as any);

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = (searchParams.get("search") || "").trim();
    const monthParam = searchParams.get("month");

    const skip = (page - 1) * limit;
    const monthRange = parseMonth(monthParam);

    const validTypes = ["INCOME", "EXPENSE"];

    const where: any = {
      userId: user.id,
      ...(monthRange
        ? {
            date: {
              gte: monthRange.start,
              lt: monthRange.end,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { category: { contains: search, mode: "insensitive" } },
              { note: { contains: search, mode: "insensitive" } },
              ...(validTypes.includes(search.toUpperCase())
              ? [{ type: search.toUpperCase() as any }]
              : []),
            ],
          }
        : {}),
    };

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          note: true,
          date: true,
          createdAt: true,
        },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return NextResponse.json({
      data: records,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        month: monthParam ?? null,
      },
    });
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

    await emitToUserRoom(user.id, "financial-update", record);

    return NextResponse.json(record);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}