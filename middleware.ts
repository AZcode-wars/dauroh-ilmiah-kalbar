import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

// Middleware memeriksa keberadaan cookie session untuk route /admin/*
// Verifikasi HMAC dilakukan di layout admin (app/admin/layout.tsx)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set custom header agar layout server bisa mendeteksi pathname saat ini
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Hanya proteksi route /admin/*, kecuali /admin/login
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Cek keberadaan cookie session
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
