import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatNomorWaForCsv } from "@/lib/csv";
import { getPesertaHeadcount } from "@/lib/headcount";
import type { ApiError } from "@/types/api";
import type { Peserta } from "@/types/peserta";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    const body: ApiError = { success: false, message: "Sesi habis atau tidak sah" };
    return NextResponse.json(body, { status: 401 });
  }

  try {
    const { data: peserta, error } = await supabaseAdmin
      .from("peserta")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const headers = [
      "nama",
      "nomor_wa",
      "menginap",
      "asal",
      "membawa_rombongan",
      "jumlah_rombongan",
      "waktu_berangkat",
      "deskripsi_berangkat",
      "waktu_kepulangan",
      "deskripsi_kepulangan",
      "jenis_kendaraan",
      "headcount",
      "paket_makan",
      "created_at",
    ];

    const rows = (peserta ?? []).map((p: Peserta) => {
      const headcount = getPesertaHeadcount(p.membawa_rombongan, p.jumlah_rombongan);
      return [
        p.nama,
        formatNomorWaForCsv(p.nomor_wa),
        String(p.menginap),
        p.asal,
        String(p.membawa_rombongan),
        p.jumlah_rombongan ?? "",
        p.waktu_berangkat ?? "",
        p.deskripsi_berangkat ?? "",
        p.waktu_kepulangan ?? "",
        p.deskripsi_kepulangan ?? "",
        p.jenis_kendaraan,
        String(headcount),
        String(headcount * 3),
        p.created_at,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="data-peserta.csv"',
      },
    });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
