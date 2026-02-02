import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const protectedPaths = [
    "/about",
    "/admin-user",
    "/album",
    "/camps",
    "/competitions",
    "/partner",
    "/travel",
    "/contact",
  ];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("accessToken");
  if (token) return NextResponse.next();

  // 🔒 Resolve real origin safely
  const forwardedHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host");

  const forwardedProto = req.headers.get("x-forwarded-proto");

  const origin =
    forwardedHost && forwardedProto
      ? `${forwardedProto}://${forwardedHost}`
      : process.env.NEXT_PUBLIC_SITE_URL!; // fallback

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
