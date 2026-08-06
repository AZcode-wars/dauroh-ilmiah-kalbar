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
      "jenis_kelamin",
      "membawa_rombongan",
      "rombongan_ikhwan_dewasa",
      "rombongan_ikhwan_anak",
      "rombongan_akhwat_dewasa",
      "rombongan_akhwat_anak",
      "is_asatidzah",
      "jumlah_asatidzah",
      "nomor_kendaraan",
      "amir_safar",
      "driver",
      "keterangan",
      "waktu_berangkat",
      "deskripsi_berangkat",
      "waktu_kepulangan",
      "deskripsi_kepulangan",
      "jenis_kendaraan",
      "headcount",
      "paket_makan_peserta",
      "paket_makan_asatidzah",
      "created_at",
      "is_hadir",
      "hadir_at",
    ];

    const rows = (peserta ?? []).map((p: Peserta) => {
      // headcount = 1 (pendaftar) + rincian rombongan; asatidzah sudah termasuk angka dewasa
      const headcount = getPesertaHeadcount(
        p.rombongan_ikhwan_dewasa,
        p.rombongan_ikhwan_anak,
        p.rombongan_akhwat_dewasa,
        p.rombongan_akhwat_anak,
      );
      // asatidzah dihitung terpisah: pendaftar (jika asatidzah) + jumlah asatidzah rombongan
      const asatidzahPeserta = (p.is_asatidzah ? 1 : 0) + p.jumlah_asatidzah;
      // 5 kali makan total selama acara (1+3+1); paket makan asatidzah dipisah dari peserta
      const paketMakanPeserta = (headcount - asatidzahPeserta) * 5;
      const paketMakanAsatidzah = asatidzahPeserta * 5;
      return [
        p.nama,
        formatNomorWaForCsv(p.nomor_wa),
        String(p.menginap),
        p.asal,
        p.jenis_kelamin,
        String(p.membawa_rombongan),
        String(p.rombongan_ikhwan_dewasa),
        String(p.rombongan_ikhwan_anak),
        String(p.rombongan_akhwat_dewasa),
        String(p.rombongan_akhwat_anak),
        String(p.is_asatidzah),
        String(asatidzahPeserta),
        p.nomor_kendaraan ?? "",
        p.amir_safar ?? "",
        p.driver ?? "",
        p.keterangan ?? "",
        p.waktu_berangkat ?? "",
        p.deskripsi_berangkat ?? "",
        p.waktu_kepulangan ?? "",
        p.deskripsi_kepulangan ?? "",
        p.jenis_kendaraan,
        String(headcount),
        String(paketMakanPeserta),
        String(paketMakanAsatidzah),
        p.created_at,
        String(p.is_hadir),
        p.hadir_at ?? "",
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="data-peserta-dauroh.csv"',
      },
    });
  } catch {
    const body: ApiError = { success: false, message: "Terjadi kesalahan sistem" };
    return NextResponse.json(body, { status: 500 });
  }
}
