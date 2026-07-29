"use client";

import Link from "next/link";

export function ClosedRegistration() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-bold text-emerald mb-3 text-center">
        Pendaftaran Tidak Tersedia
      </h1>

      <p className="text-emerald/60 font-sans text-center max-w-md mb-8 leading-relaxed">
        Saat ini belum memasuki periode pendaftaran. Silahkan kembali lagi nanti.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-emerald text-cream font-sans font-semibold px-6 py-3 rounded-xl hover:bg-emerald-soft transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Beranda
      </Link>
    </main>
  );
}
