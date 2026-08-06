"use client";

import type { Peserta } from "@/types/peserta";
import { KABUPATEN_KALBAR, JENIS_KENDARAAN } from "@/lib/constants";
import { formatToWIB } from "@/lib/dates";

interface ConfirmationSummaryProps {
  peserta: Peserta;
}

export function buildConfirmationRows(peserta: Peserta): Array<{ label: string; value: string }> {
  const asalLabel = KABUPATEN_KALBAR.find((k) => k === peserta.asal) || peserta.asal;
  const kendaraanLabel = JENIS_KENDARAAN.find((k) => k.value === peserta.jenis_kendaraan)?.label || peserta.jenis_kendaraan;

  // Total orang dalam rombongan termasuk pendaftar
  const totalRombongan =
    1 +
    peserta.rombongan_ikhwan_dewasa +
    peserta.rombongan_ikhwan_anak +
    peserta.rombongan_akhwat_dewasa +
    peserta.rombongan_akhwat_anak;

  const rombonganValue = peserta.membawa_rombongan
    ? [
        `Ya (total ${totalRombongan} orang)`,
        `Ikhwan dewasa: ${peserta.rombongan_ikhwan_dewasa} · Anak: ${peserta.rombongan_ikhwan_anak}`,
        `Akhwat dewasa: ${peserta.rombongan_akhwat_dewasa} · Anak: ${peserta.rombongan_akhwat_anak}`,
        `Asatidzah: ${(peserta.is_asatidzah ? 1 : 0) + peserta.jumlah_asatidzah}${peserta.is_asatidzah ? " (termasuk Anda)" : ""}`,
      ].join("\n")
    : "Tidak";

  return [
    { label: "Nama", value: peserta.nama },
    { label: "Nomor WA", value: peserta.nomor_wa },
    { label: "Asal", value: asalLabel },
    {
      label: "Jenis Kelamin",
      value: peserta.jenis_kelamin === "ikhwan" ? "Ikhwan Dewasa" : "Akhwat Dewasa",
    },
    { label: "Menginap", value: peserta.menginap ? "Ya" : "Tidak" },
    { label: "Rombongan", value: rombonganValue },
    ...(peserta.membawa_rombongan
      ? [
          { label: "Amir Safar", value: peserta.amir_safar ?? "-" },
          { label: "Driver", value: peserta.driver ?? "-" },
        ]
      : []),
    {
      label: "Keberangkatan",
      value: peserta.tipe_waktu_berangkat === "jam_pasti"
        ? `Jam Pasti - ${formatToWIB(peserta.waktu_berangkat)}`
        : `Fleksibel - ${peserta.deskripsi_berangkat ?? "-"}`,
    },
    {
      label: "Kepulangan",
      value: peserta.tipe_waktu_kepulangan === "jam_pasti"
        ? `Jam Pasti - ${formatToWIB(peserta.waktu_kepulangan)}`
        : `Fleksibel - ${peserta.deskripsi_kepulangan ?? "-"}`,
    },
    { label: "Kendaraan", value: kendaraanLabel },
    { label: "Nomor Kendaraan", value: peserta.nomor_kendaraan ?? "-" },
    ...(peserta.keterangan ? [{ label: "Keterangan", value: peserta.keterangan }] : []),
  ];
}

export function buildConfirmationMessage(peserta: Peserta): string {
  const rows = buildConfirmationRows(peserta);
  const body = rows.map((row) => `${row.label}: ${row.value}`).join("\n");
  return `Assalamu'alaikum, saya ingin konfirmasi pendaftaran Dauroh Ilmiah Kalbar - Manis Raya 2026.\n\n${body}`;
}

export function ConfirmationSummary({ peserta }: ConfirmationSummaryProps) {
  const rows = buildConfirmationRows(peserta);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)]">
      <h3 className="font-sans text-sm font-semibold tracking-[0.2em] text-emerald/60 uppercase mb-4 border-b border-emerald/10 pb-2">
        Ringkasan Data
      </h3>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-start gap-4">
            <span className="text-emerald/60 font-sans text-sm font-medium shrink-0">
              {row.label}
            </span>
            <span className="text-emerald font-sans text-sm font-semibold text-right whitespace-pre-line">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
