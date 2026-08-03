import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ABOUT_IMAGES_BUCKET } from "@/lib/about-images";
import type { ApiError, ApiSuccess } from "@/types/api";

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
    const parsedId = z.string().uuid().safeParse(id);
    if (!parsedId.success) {
      const body: ApiError = { success: false, message: "Gambar tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    const { data: row, error: queryError } = await supabaseAdmin
      .from("about_images")
      .select("id, storage_path")
      .eq("id", parsedId.data)
      .maybeSingle();

    if (queryError || !row) {
      const body: ApiError = { success: false, message: "Gambar tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    await supabaseAdmin.rpc("delete_about_image", { p_id: parsedId.data });

    const { error: removeError } = await supabaseAdmin.storage
      .from(ABOUT_IMAGES_BUCKET)
      .remove([row.storage_path]);

    if (removeError) {
      const body: ApiError = {
        success: false,
        message: "Metadata gambar dihapus, tetapi file gagal dibersihkan",
      };
      return NextResponse.json(body, { status: 500 });
    }

    const body: ApiSuccess<null> = {
      success: true,
      message: "Gambar galeri berhasil dihapus",
      data: null,
    };
    return NextResponse.json(body);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}