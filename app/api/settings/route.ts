import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Mengembalikan pengaturan pendaftaran untuk halaman publik
export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      registration_open_at: settings.registration_open_at,
      registration_close_at: settings.registration_close_at,
      contact_person_wa: settings.contact_person_wa,
    });
  } catch {
    return NextResponse.json(
      { error: "Settings not found" },
      { status: 404 }
    );
  }
}
