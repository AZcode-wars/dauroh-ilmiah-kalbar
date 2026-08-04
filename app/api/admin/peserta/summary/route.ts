import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSummary } from "@/lib/peserta";
import type { ApiError } from "@/types/api";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const summary = await getSummary();
    return NextResponse.json(summary);
  } catch (error: unknown) {
    // Mencatat error asli untuk debugging di log server (Cloudflare Logs / wrangler tail)
    console.error("Gagal mengambil ringkasan peserta:", error);
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
