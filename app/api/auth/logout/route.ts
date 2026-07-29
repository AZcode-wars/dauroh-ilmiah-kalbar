import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

// Logout admin: hapus cookie session
export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logout berhasil" }
  );

  response.cookies.delete(ADMIN_SESSION_COOKIE);

  return response;
}
