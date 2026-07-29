import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { updateSettingsSchema } from "@/lib/validations";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ApiError, ApiSuccess } from "@/types/api";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch {
    const body: ApiError = { success: false, message: "Pengaturan tidak ditemukan" };
    return NextResponse.json(body, { status: 404 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.map(String),
        message: issue.message,
      }));
      const res: ApiError = { success: false, message: "Data tidak valid", errors };
      return NextResponse.json(res, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!existing) {
      const body: ApiError = { success: false, message: "Pengaturan tidak ditemukan" };
      return NextResponse.json(body, { status: 404 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("settings")
      .update({
        registration_open_at: parsed.data.registration_open_at,
        registration_close_at: parsed.data.registration_close_at,
        contact_person_wa: parsed.data.contact_person_wa,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    const res: ApiSuccess<{
      registration_open_at: string;
      registration_close_at: string;
      contact_person_wa: string;
    }> = {
      success: true,
      message: "Pengaturan berhasil disimpan",
      data: {
        registration_open_at: updated.registration_open_at,
        registration_close_at: updated.registration_close_at,
        contact_person_wa: updated.contact_person_wa,
      },
    };
    return NextResponse.json(res);
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
