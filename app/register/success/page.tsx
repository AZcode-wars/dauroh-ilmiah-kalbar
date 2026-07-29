"use client";

import { useState } from "react";
import Link from "next/link";
import type { Peserta } from "@/types/peserta";
import { ConfirmationSummary } from "@/components/register/ConfirmationSummary";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function SuccessPage() {
  const [data] = useState<Peserta | null>(() => {
    // Baca data dari sessionStorage yang disimpan saat submit berhasil
    // Gunakan lazy initializer agar hanya dijalankan sekali di mount
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("registration_success_data");
        return raw ? (JSON.parse(raw) as Peserta) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  if (!data) {
    return (
      <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
        <p className="text-emerald/60 font-sans mb-4">Data pendaftaran tidak ditemukan.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald text-cream font-sans font-semibold px-6 py-3 rounded-xl hover:bg-emerald-soft transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  const waUrl = buildWhatsAppUrl(data.nomor_wa, "Assalamu'alaikum, saya ingin bertanya tentang Dauroh Manis Raya");

  return (
    <main className="min-h-screen bg-cream">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-cream h-16 flex items-center px-4 border-b border-emerald/5">
        <Link href="/" className="w-10 h-10 flex items-center justify-center text-emerald hover:opacity-80 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="ml-4 font-serif text-lg font-semibold text-emerald">Konfirmasi</h1>
      </header>

      <div className="pt-24 pb-32 px-4 max-w-md mx-auto flex flex-col gap-6">
        {/* Success Header */}
        <section className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-soft rounded-full mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-serif text-2xl font-bold text-emerald mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="font-sans text-emerald/60">
            Terima kasih telah mendaftar Dauroh Ilmiah Kalbar
          </p>
        </section>

        {/* Summary Card */}
        <ConfirmationSummary peserta={data} />

        {/* Info Box */}
        <div className="bg-emerald/5 border border-emerald/10 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-emerald shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald font-sans text-sm leading-relaxed">
              Pendaftaran Anda akan kami proses. Informasi lebih lanjut akan dikirim melalui WhatsApp ke nomor yang didaftarkan.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-emerald text-emerald font-sans font-semibold py-4 rounded-xl hover:bg-emerald/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Hubungi Panitia via WhatsApp
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-emerald text-cream font-sans font-semibold py-4 rounded-xl hover:bg-emerald-soft transition-colors shadow-lg shadow-emerald/20"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
