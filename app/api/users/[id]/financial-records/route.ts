import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const records = await prisma.financialRecord.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ data: records });
}