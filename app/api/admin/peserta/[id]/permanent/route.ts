import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { permanentDeletePeserta } from "@/lib/peserta";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ApiError } from "@/types/api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data: existing } = await supabaseAdmin
      .from("peserta")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      const body: ApiError = { success: false, message: "Peserta tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    await permanentDeletePeserta(id);

    return NextResponse.json({ success: true, message: "Peserta berhasil dihapus permanen" });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
