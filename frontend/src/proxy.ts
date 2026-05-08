import { NextRequest, NextResponse } from "next/server"

// Public routes (no auth required)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/sign-up",
  "/verify",
  "/about",
  "/contact",
  "/browse",
  "/roommates",
]

// 🔥 Helper: check token from cookies (optional)
// NOTE: localStorage is NOT available in middleware
const getTokenFromCookie = (req: NextRequest) => {
  return req.cookies.get("token")?.value || null;
};

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Allow Next.js internal files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔥 Get token from cookie
  const token = getTokenFromCookie(req);

  // ❌ Not logged in
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Logged in
  return NextResponse.next();
};