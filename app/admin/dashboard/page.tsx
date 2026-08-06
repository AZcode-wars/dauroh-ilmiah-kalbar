"use client";

import SummaryCards from "@/components/admin/SummaryCards";
import PesertaTable from "@/components/admin/PesertaTable";
import ExportCsvButton from "@/components/admin/ExportCsvButton";

// Halaman dashboard utama admin: ringkasan + daftar peserta + ekspor CSV
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="font-serif text-2xl font-bold text-emerald">
            Dashboard Pendaftar
          </h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan dan daftar peserta Dauroh Ilmiah Kalbar
          </p>
        </div>
        <ExportCsvButton />
      </div>

      {/* Kartu Ringkasan */}
      <div className="shrink-0">
        <SummaryCards />
      </div>

      {/* Tabel Peserta */}
      <PesertaTable />
    </div>
  );
}
