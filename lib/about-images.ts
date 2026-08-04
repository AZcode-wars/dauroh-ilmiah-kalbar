import { z } from "zod";
import { supabaseAdmin } from "./supabase/server";
import type { AboutImage } from "@/types/about-image";

export const ABOUT_IMAGES_BUCKET = "about-images";
export const ABOUT_IMAGE_LIMIT = 10;
export const ABOUT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const ABOUT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const FALLBACK_ABOUT_IMAGE: AboutImage = {
  id: "fallback-about-poster",
  storage_path: "/images/about-poster.jfif",
  alt_text: "Poster Kajian Muslimah",
  sort_order: 0,
  created_at: new Date(0).toISOString(),
  url: "/images/about-poster.jfif",
};

// Schema Zod untuk memvalidasi hasil query baris `about_images`
// tanpa perlu type assertion (`as AboutImageRecord[]`).
export const aboutImageRecordsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    storage_path: z.string(),
    alt_text: z.string(),
    sort_order: z.number(),
    created_at: z.string(),
  })
);

export function getAboutImagePublicUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${ABOUT_IMAGES_BUCKET}/${storagePath}`;
}

export async function getAboutImages(): Promise<AboutImage[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("about_images")
      .select("id, storage_path, alt_text, sort_order, created_at")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    return aboutImageRecordsSchema.parse(data).map((image) => ({
      ...image,
      url: getAboutImagePublicUrl(image.storage_path),
    }));
  } catch {
    return [];
  }
}
