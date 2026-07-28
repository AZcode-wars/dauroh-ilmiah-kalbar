import { supabaseAdmin } from "./supabase/server";
import type { Settings } from "@/types/settings";

export const FALLBACK_SETTINGS: Settings = {
  id: "fallback-settings",
  registration_open_at: "2026-08-01T00:00:00.000Z",
  registration_close_at: "2026-08-18T17:00:00.000Z",
  contact_person_wa: "081234567890",
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Fallback mencegah halaman publik crash jika settings belum di-seed.
    return FALLBACK_SETTINGS;
  }

  return data;
}