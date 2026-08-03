import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { reorderAboutImagesSchema } from "@/lib/validations";
import { aboutImageRecordsSchema, getAboutImagePublicUrl } from "@/lib/about-images";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { AboutImage } from "@/types/about-image";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const parsed = reorderAboutImagesSchema.safeParse(await request.json());
    if (!parsed.success) {
      const body: ApiError = {
        success: false,
        message: "Data tidak valid",
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      };
      return NextResponse.json(body, { status: 400 });
    }

    const { data: rows, error: rpcError } = await supabaseAdmin.rpc("reorder_about_images", {
      p_ids: parsed.data.ids,
    });

    if (rpcError) {
      const body: ApiError = { success: false, message: "Urutan gambar tidak valid" };
      return NextResponse.json(body, { status: 400 });
    }

    const records = aboutImageRecordsSchema.parse(rows);
    const images: AboutImage[] = records.map((image) => ({
      ...image,
      url: getAboutImagePublicUrl(image.storage_path),
    }));

    const body: ApiSuccess<AboutImage[]> = {
      success: true,
      message: "Urutan galeri berhasil disimpan",
      data: images,
    };
    return NextResponse.json(body);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}