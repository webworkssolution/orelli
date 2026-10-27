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
  const isSecure =
    req.url.startsWith("https://") ||
    req.headers.get("x-forwarded-proto") === "https" ||
    process.env.NODE_ENV === "production";

  // Check with both secure and standard cookie options to ensure sessions work across reverse proxies
  let token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });

  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: !isSecure,
    });
  }
  
  if (!token && (req.nextUrl.pathname === "/admin" || req.nextUrl.pathname === "/admin/")) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("callbackUrl", "/admin/categories");
    return NextResponse.redirect(url);
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  // @ts-ignore
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
