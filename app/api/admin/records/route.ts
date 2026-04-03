import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

function parseMonth(month: string | null): { start: Date; end: Date } | null {
  if (!month) return null;
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex0 = Number(match[2]) - 1; // 0-11
  if (!Number.isFinite(year) || monthIndex0 < 0 || monthIndex0 > 11) return null;

  const start = new Date(Date.UTC(year, monthIndex0, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex0 + 1, 1, 0, 0, 0));
  return { start, end };
}

export async function GET(req: Request) {
  try {
    const user: any = requireRole(["ADMIN"])(req as any);
    void user;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = (searchParams.get("search") || "").trim();
    const monthParam = searchParams.get("month");

    // Default to current month so pagination is meaningful.
    const now = new Date();
    const defaultMonth = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    const month = monthParam ?? defaultMonth;
    const monthRange = parseMonth(month);

    const skip = (page - 1) * limit;

    const or: any[] = [];
    if (search) {
      const upper = search.toUpperCase();
      if (upper === "INCOME" || upper === "EXPENSE") {
        or.push({ type: upper });
      }

      or.push(
        { category: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      );
    }

    const where: any = {
      ...(monthRange
        ? {
            date: {
              gte: monthRange.start,
              lt: monthRange.end,
            },
          }
        : {}),
      ...(or.length ? { OR: or } : {}),
    };

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          note: true,
          date: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
        month,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

