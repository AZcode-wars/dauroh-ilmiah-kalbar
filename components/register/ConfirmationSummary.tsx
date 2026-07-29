"use client";

import type { Peserta } from "@/types/peserta";
import { KABUPATEN_KALBAR, JENIS_KENDARAAN } from "@/lib/constants";
import { formatToWIB } from "@/lib/dates";

interface ConfirmationSummaryProps {
  peserta: Peserta;
}

export function ConfirmationSummary({ peserta }: ConfirmationSummaryProps) {
  const asalLabel = KABUPATEN_KALBAR.find((k) => k === peserta.asal) || peserta.asal;
  const kendaraanLabel = JENIS_KENDARAAN.find((k) => k.value === peserta.jenis_kendaraan)?.label || peserta.jenis_kendaraan;

  const rows: Array<{ label: string; value: string }> = [
    { label: "Nama", value: peserta.nama },
    { label: "Nomor WA", value: peserta.nomor_wa },
    { label: "Asal", value: asalLabel },
    { label: "Menginap", value: peserta.menginap ? "Ya" : "Tidak" },
    {
      label: "Rombongan",
      value: peserta.membawa_rombongan
        ? `Ya (${peserta.jumlah_rombongan ?? 0} orang)`
        : "Tidak",
    },
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
  ];

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
            <span className="text-emerald font-sans text-sm font-semibold text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
