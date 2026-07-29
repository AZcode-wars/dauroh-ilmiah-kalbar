import { NextResponse } from "next/server";
import { registerPesertaSchema, canonicalizeRegisterInput } from "@/lib/validations";
import { getSettings } from "@/lib/settings";
import { isWithinRegistrationWindow } from "@/lib/dates";
import { createPeserta, checkDuplicateWa } from "@/lib/peserta";
import type { ApiSuccess, ApiError } from "@/types/api";
import type { Peserta } from "@/types/peserta";

// Mendaftarkan peserta baru dengan validasi dan canonicalization
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input menggunakan Zod schema
    const parsed = registerPesertaSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.map(String),
        message: issue.message,
      }));

      const response: ApiError = {
        success: false,
        message: "Data tidak valid",
        errors,
      };

      return NextResponse.json(response, { status: 400 });
    }

    // Normalisasi data sebelum dimasukkan ke database
    const canonicalized = canonicalizeRegisterInput(parsed.data);

    // Cek apakah pendaftaran masih dalam periode yang ditentukan
    const settings = await getSettings();

    if (!isWithinRegistrationWindow(settings)) {
      const response: ApiError = {
        success: false,
        message: "Pendaftaran Tidak Tersedia",
      };

      return NextResponse.json(response, { status: 400 });
    }

    // Cek apakah nomor WA sudah terdaftar (UX pre-check sebelum insert)
    const isDuplicate = await checkDuplicateWa(canonicalized.nomor_wa);

    if (isDuplicate) {
      const response: ApiError = {
        success: false,
        message: "Nomor sudah terdaftar. Silahkan gunakan nomor lain",
      };

      return NextResponse.json(response, { status: 409 });
    }

    // Masukkan data ke database
    const peserta = await createPeserta(canonicalized);

    const response: ApiSuccess<Peserta> = {
      success: true,
      message: "Pendaftaran berhasil",
      data: peserta,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    // Tangani error unique constraint violation dari PostgreSQL (kode 23505)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      const response: ApiError = {
        success: false,
        message: "Nomor sudah terdaftar. Silahkan gunakan nomor lain",
      };

      return NextResponse.json(response, { status: 409 });
    }

    const response: ApiError = {
      success: false,
      message: "Terjadi kesalahan sistem",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
