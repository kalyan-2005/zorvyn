import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/register"];
const publicPages = ["/", ...authPages];
const protectedPages = [
  "/dashboard",
  "/records",
  "/api/dashboard",
  "/api/records",
  "/api/users",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("auth-token")?.value;

  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const isProtectedPage = protectedPages.some((page) =>
    pathname.startsWith(page),
  );

  // Not signed in: protect paths (dashboard/records/api protected ops)
  if (isProtectedPage && !authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Signed in: keep them off auth pages and landing page
  if (authToken && (isAuthPage || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/records/:path*",
    "/api/dashboard/:path*",
    "/api/records/:path*",
    "/api/users/:path*",
    "/api/auth/me",
    "/login",
    "/register",
    "/",
  ],
};
