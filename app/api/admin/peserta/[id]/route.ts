import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { softDeletePeserta } from "@/lib/peserta";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { Peserta } from "@/types/peserta";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("peserta")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const body: ApiError = { success: false, message: "Peserta tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    const body: ApiSuccess<Peserta> = { success: true, message: "", data };
    return NextResponse.json(body);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}

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
      .eq("is_deleted", false)
      .maybeSingle();

    if (!existing) {
      const body: ApiError = { success: false, message: "Peserta tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    await softDeletePeserta(id);

    return NextResponse.json({ success: true, message: "Peserta berhasil dihapus" });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
