import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { JENIS_KENDARAAN } from "@/lib/constants";
import { getPesertaHeadcount } from "@/lib/headcount";
import type { Peserta } from "@/types/peserta";

// Shape ringkasan peserta yang dikembalikan /api/admin/peserta/summary
export type ExportSummary = {
  total_headcount: number;
  total_asatidzah: number;
  total_ikhwan_dewasa: number;
  total_akhwat_dewasa: number;
  total_anak_laki: number;
  total_anak_perempuan: number;
};

// Membuat tanggal lengkap dalam Bahasa Indonesia, mis. "7 Agustus 2026".
export function formatTanggalIndonesia(d: Date = new Date()): string {
  return format(d, "d MMMM yyyy", { locale: idLocale });
}

// Label jenis kendaraan (Motor/Mobil/Angkutan Umum) dari nilai DB
function kendaraanLabel(jenis: Peserta["jenis_kendaraan"]): string {
  return JENIS_KENDARAAN.find((k) => k.value === jenis)?.label ?? jenis;
}

// Membangun teks plain "Copy Format Peserta" yang akan dibagikan ke grup WhatsApp.
// Data dikelompokkan per asal berdasarkan urutan kemunculan di dalam data.
export function buildFormatPeserta(
  pesertaList: Peserta[],
  summary: ExportSummary,
): string {
  const header = `Update Data Peserta Dauroh Ilmiah Kalbar di Manis Raya 2026 (21 Agustus - 23 Agustus/9 - 11 Rabi'ul Awwal 1448 H) per ${formatTanggalIndonesia()}`;
  const barisTotal = [
    `Total Peserta yang terdata: ${summary.total_headcount}`,
    `Total Asatidzah yang terdata: ${summary.total_asatidzah}`,
  ];

  // Kelompokkan peserta berdasarkan nilai asal, pertahankan urutan kemunculan pertama.
  const byAsal = new Map<string, Peserta[]>();
  for (const p of pesertaList) {
    const daftar = byAsal.get(p.asal) ?? [];
    daftar.push(p);
    byAsal.set(p.asal, daftar);
  }

  const blokRincian: string[] = [];
  for (const [asal, list] of byAsal) {
    blokRincian.push(`Rincian Peserta dari ${asal}`);
    list.forEach((p, i) => {
      const headcount = getPesertaHeadcount(
        p.rombongan_ikhwan_dewasa,
        p.rombongan_ikhwan_anak,
        p.rombongan_akhwat_dewasa,
        p.rombongan_akhwat_anak,
      );
      const nomor = p.nomor_kendaraan ?? "-";
      const kend = `${kendaraanLabel(p.jenis_kendaraan)} (${nomor})`;
      blokRincian.push(
        `${i + 1}. ${p.nama}`,
        `   Total: ${headcount} orang`,
        `   Kendaraan: ${kend}`,
      );
    });
    blokRincian.push("");
  }

  return [
    header,
    "_____________________",
    "",
    ...barisTotal,
    "",
    blokRincian.join("\n"),
  ].join("\n");
}

// Menyusun teks plain "Copy Format Konsumsi" (jumlah porsi makan per kelompok).
export function buildFormatKonsumsi(summary: ExportSummary): string {
  const porsiIkhwan =
    (summary.total_ikhwan_dewasa + summary.total_anak_laki) * 5;
  const porsiAkhwat =
    (summary.total_akhwat_dewasa + summary.total_anak_perempuan) * 5;
  const porsiAsatidzah = summary.total_asatidzah * 5;

  return [
    `Update Data Konsumsi per ${formatTanggalIndonesia()}`,
    `Total Konsumsi Peserta Ikhwan: ${porsiIkhwan} Porsi`,
    `Total Konsumsi Peserta Akhwat: ${porsiAkhwat} Porsi`,
    `Total Konsumsi Asatidzah: ${porsiAsatidzah} Porsi`,
  ].join("\n");
}
