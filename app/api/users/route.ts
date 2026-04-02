import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    requireRole(["ADMIN"])(req as any);
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { email: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { status } : {},
        role ? { role } : {},
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },

        // 🔥 IMPORTANT: only select needed fields
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
        },
      }),

      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}