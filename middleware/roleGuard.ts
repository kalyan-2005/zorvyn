import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function requireRole(allowedRoles: string[]) {
  return (req: NextRequest) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) throw new Error("Unauthorized");

    const user: any = verifyToken(token);

    if (!allowedRoles.includes(user.role)) {
      throw new Error("Forbidden");
    }

    return user;
  };
}
