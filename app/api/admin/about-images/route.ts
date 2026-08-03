import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  ABOUT_IMAGES_BUCKET,
  ABOUT_IMAGE_MAX_BYTES,
  ABOUT_IMAGE_LIMIT,
  getAboutImages,
  aboutImageRecordsSchema,
  getAboutImagePublicUrl,
} from "@/lib/about-images";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { AboutImage } from "@/types/about-image";

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function errorJson(message: string, status: number, errors?: ApiError["errors"]): NextResponse {
  const body: ApiError = { success: false, message, ...(errors ? { errors } : {}) };
  return NextResponse.json(body, { status });
}

function isFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    "type" in value
  );
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return errorJson("Sesi habis atau tidak sah", 401);
  }

  try {
    const images = await getAboutImages();
    return NextResponse.json({
      success: true,
      message: "Galeri berhasil dimuat",
      data: images,
    } satisfies ApiSuccess<AboutImage[]>);
  } catch {
    return errorJson("Terjadi kesalahan sistem", 500);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return errorJson("Sesi habis atau tidak sah", 401);
  }

  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll("files");
    const rawAltTexts = formData.getAll("alt_texts");

    if (rawFiles.length === 0 || rawFiles.length !== rawAltTexts.length) {
      return errorJson("Data tidak valid", 400);
    }

    // Tolak jika jumlah file melampaui batas yang tersisa setelah gambar tersimpan
    const currentCount = (await getAboutImages()).length;
    if (currentCount + rawFiles.length > ABOUT_IMAGE_LIMIT) {
      return errorJson("Data tidak valid", 400);
    }

    const files: File[] = [];
    const altTexts: string[] = [];
    for (let i = 0; i < rawFiles.length; i += 1) {
      const file = rawFiles[i];
      const alt = rawAltTexts[i];
      if (!isFile(file) || typeof alt !== "string") {
        return errorJson("Data tidak valid", 400);
      }
      const extension = MIME_TO_EXTENSION[file.type];
      if (!extension) {
        return errorJson("Data tidak valid", 400);
      }
      if (file.size > ABOUT_IMAGE_MAX_BYTES) {
        return errorJson("Data tidak valid", 400);
      }
      if (alt.trim().length < 1 || alt.trim().length > 160) {
        return errorJson("Data tidak valid", 400);
      }
      files.push(file);
      altTexts.push(alt.trim());
    }

    const uploadedPaths: string[] = [];
    const uploadedMetadata: Array<{ storage_path: string; alt_text: string }> = [];
    try {
      for (let i = 0; i < files.length; i += 1) {
        const extension = MIME_TO_EXTENSION[files[i].type];
        const path = `about/${crypto.randomUUID()}.${extension}`;
        const buffer = Buffer.from(await files[i].arrayBuffer());
        const { error } = await supabaseAdmin.storage
          .from(ABOUT_IMAGES_BUCKET)
          .upload(path, buffer, { contentType: files[i].type, upsert: false });
        if (error) {
          throw new Error(error.message);
        }
        uploadedPaths.push(path);
        uploadedMetadata.push({ storage_path: path, alt_text: altTexts[i] });
      }

      const { data: rows, error: rpcError } = await supabaseAdmin.rpc("create_about_images", {
        p_images: uploadedMetadata,
      });
      if (rpcError) {
        throw new Error(rpcError.message);
      }

      const records = aboutImageRecordsSchema.parse(rows);
      const images: AboutImage[] = records.map((image) => ({
        ...image,
        url: getAboutImagePublicUrl(image.storage_path),
      }));

      return NextResponse.json({
        success: true,
        message: "Gambar galeri berhasil diunggah",
        data: images,
      } satisfies ApiSuccess<AboutImage[]>);
    } catch {
      if (uploadedPaths.length > 0) {
        await supabaseAdmin.storage.from(ABOUT_IMAGES_BUCKET).remove(uploadedPaths);
      }
      return errorJson("Terjadi kesalahan sistem", 500);
    }
  } catch {
    return errorJson("Terjadi kesalahan sistem", 500);
  }
}