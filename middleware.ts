import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const authMiddleware = withAuth({
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token && (req.nextUrl.pathname === "/admin" || req.nextUrl.pathname === "/admin/")) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("callbackUrl", "/admin/categories");
    return NextResponse.redirect(url);
  }

  // @ts-ignore
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
