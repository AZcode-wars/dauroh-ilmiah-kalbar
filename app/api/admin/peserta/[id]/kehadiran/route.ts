import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { markPesertaHadir, unmarkPesertaHadir } from "@/lib/peserta";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ApiError, ApiSuccess } from "@/types/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const { id } = await params;

    // Cek peserta ada dan masih aktif (tidak dihapus)
    const { data: existing } = await supabaseAdmin
      .from("peserta")
      .select("id")
      .eq("id", id)
      .eq("is_deleted", false)
      .maybeSingle();

    if (!existing) {
      const body: ApiError = { success: false, message: "Peserta tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    // Validasi body hadir harus boolean
    const body: unknown = await request.json();
    const hadir = (body as { hadir?: unknown }).hadir;
    if (typeof hadir !== "boolean") {
      const errorBody: ApiError = { success: false, message: "Data tidak valid" };
      return NextResponse.json(errorBody, { status: 400 });
    }

    // Tandai hadir atau batalkan tanda hadir
    if (hadir) {
      await markPesertaHadir(id);
    } else {
      await unmarkPesertaHadir(id);
    }

    const successBody: ApiSuccess<null> = {
      success: true,
      message: hadir ? "Peserta berhasil ditandai hadir" : "Tanda hadir dibatalkan",
      data: null,
    };
    return NextResponse.json(successBody);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
