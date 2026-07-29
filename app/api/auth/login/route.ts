import { NextResponse } from "next/server";
import { createAdminSessionToken } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

// Login admin: verifikasi password dan set cookie session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Bandingkan dengan password dari environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    // Buat token session yang ditandatangani dengan HMAC
    const token = await createAdminSessionToken();

    const response = NextResponse.json(
      { success: true, message: "Login berhasil" }
    );

    // Set cookie httpOnly untuk keamanan XSS, secure hanya di production
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan sistem" },
      { status: 500 }
    );
  }
}
