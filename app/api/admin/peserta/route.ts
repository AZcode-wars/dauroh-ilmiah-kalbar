import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getActivePeserta, createPeserta } from "@/lib/peserta";
import { registerPesertaSchema, canonicalizeRegisterInput } from "@/lib/validations";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { Peserta } from "@/types/peserta";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const data = await getActivePeserta({
      search: searchParams.get("search") || undefined,
      asal: searchParams.get("asal") || undefined,
      menginap: (searchParams.get("menginap") as "true" | "false") || undefined,
      kendaraan: (searchParams.get("kendaraan") as "motor" | "mobil" | "angkutan_umum") || undefined,
      rombongan: (searchParams.get("rombongan") as "true" | "false") || undefined,
    });

    return NextResponse.json({ data });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = registerPesertaSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.map(String),
        message: issue.message,
      }));
      const res: ApiError = { success: false, message: "Data tidak valid", errors };
      return NextResponse.json(res, { status: 400 });
    }

    const canonicalized = canonicalizeRegisterInput(parsed.data);
    const peserta = await createPeserta(canonicalized);

    const res: ApiSuccess<Peserta> = { success: true, message: "Peserta berhasil ditambahkan", data: peserta };
    return NextResponse.json(res);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      const body: ApiError = { success: false, message: "Nomor sudah terdaftar" };
      return NextResponse.json(body, { status: 409 });
    }

    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
