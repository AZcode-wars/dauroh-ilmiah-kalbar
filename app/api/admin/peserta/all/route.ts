import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { permanentDeleteAllPeserta } from "@/lib/peserta";
import type { ApiError, ApiSuccess } from "@/types/api";

// Menghapus SEMUA data peserta secara permanen — zona bahaya, hanya dari halaman Settings
export async function DELETE() {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    await permanentDeleteAllPeserta();

    const body: ApiSuccess<null> = { success: true, message: "Semua data peserta berhasil dihapus permanen", data: null };
    return NextResponse.json(body);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
