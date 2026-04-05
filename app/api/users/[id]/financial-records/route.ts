import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  requireRole(["ADMIN", "VIEWER"])(req);
  const { id } = await context.params;
  const records = await prisma.financialRecord.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ data: records });
}