import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDeletedPeserta } from "@/lib/peserta";
import type { ApiError } from "@/types/api";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const data = await getDeletedPeserta();
    return NextResponse.json({ data });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
