"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CalendarDays, MapPin, LibraryBig } from "lucide-react";
import { AnimateOnMount } from "@/components/AnimateOnMount";

interface HeroSectionProps {
  contactWa: string;
}

const menuLinks = [
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Jadwal", href: "#rundown" },
  { label: "Lokasi", href: "#lokasi" },
  { label: "Hubungi Kami", href: "#cta" },
];

export function HeroSection({ contactWa }: HeroSectionProps) {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup sidebar dengan tombol Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  // Cegah scroll body saat sidebar terbuka
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const waUrl = buildWhatsAppUrl(
    contactWa,
    "Assalamu'alaikum, saya ingin bertanya tentang Dauroh Manis Raya",
  );

  return (
    <section className="relative min-h-screen flex flex-col bg-linear-to-b from-emerald-soft to-emerald overflow-hidden">
      {/* Pattern dekoratif islami di background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="islamic-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Lingkaran blur dekoratif */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cream blur-3xl" />
      </div>

      {/* Navbar fixed dengan efek glassmorphism saat scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-emerald-soft/70 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,53,39,0.15)]"
            : "bg-transparent"
        }`}
      >
        {/* Mobile: hamburger kiri, logo teks tetap */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1 text-cream hover:text-gold transition-colors"
            aria-label="Buka menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2 text-cream">
            <LibraryBig />
            <span className="font-serif font-semibold text-lg tracking-wide">
              Dauroh Manis Raya
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-cream/70 hover:text-cream font-sans text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/register"
            className="bg-gold text-emerald font-sans font-semibold text-sm px-5 py-2 rounded-xl hover:bg-gold/90 transition-colors"
          >
            Daftar
          </Link>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-cream shadow-2xl md:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald"
            onClick={closeSidebar}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="font-serif font-semibold text-lg tracking-wide">
              Dauroh Manis Raya
            </span>
          </Link>

          <button
            onClick={closeSidebar}
            className="p-1 text-emerald/50 hover:text-emerald transition-colors"
            aria-label="Tutup menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu sidebar */}
        <div className="flex flex-col gap-1 px-3 py-6">
          {menuLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeSidebar}
              className="block px-4 py-3 rounded-xl text-emerald/70 hover:text-emerald hover:bg-emerald/5 font-sans text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-emerald/10" />

        {/* CTA di sidebar */}
        <div className="px-5 pt-6">
          <Link
            href="/register"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-2 w-full bg-gold text-emerald font-sans font-semibold px-6 py-3 rounded-xl hover:bg-gold/90 transition-colors"
          >
            Daftar Sekarang
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Konten hero — pt-16 mengimbangi tinggi fixed navbar */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge tanggal */}
          <AnimateOnMount delay={100}>
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              <span className="inline-flex gap-1.5 bg-cream/10 text-cream/80 text-xs font-sans font-medium px-3 py-1.5 rounded-full border border-cream/20">
                <span className="flex items-start shrink-0">
                  <CalendarDays size={15} />
                </span>
                21–23 Agustus 2026
              </span>
              <span className="inline-flex gap-1.5 bg-cream/10 text-cream/50 text-xs font-sans font-medium px-3 py-1.5 rounded-full border border-cream/20">
                <MapPin size={15} />
                Sintang-Manis Raya
              </span>
            </div>
          </AnimateOnMount>

          <AnimateOnMount delay={200}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight md:leading-tight mb-6">
              Dauroh Ilmiah <span className="text-gold">Kalbar</span>
            </h1>
          </AnimateOnMount>

          <AnimateOnMount delay={300}>
            <p className="text-cream/50 font-sans text-xs md:text-sm font-medium tracking-widest uppercase mb-8">
              Dengan Tema
            </p>
          </AnimateOnMount>

          <AnimateOnMount delay={350}>
            <p className="text-cream/80 font-sans text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
              Pengaruh Dekadensi Moral Terhadap Sosial Umat dan Bangsa
            </p>
          </AnimateOnMount>

          {/* Pemateri */}
          <AnimateOnMount delay={400}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full border-2 border-gold/50 bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <p className="text-cream/60 font-sans text-sm">
                Ustadz{" "}
                <span className="text-cream/90 font-semibold">Abu Fulan</span>{" "}
                <span className="text-cream/50 italic">
                  hafizhahullahu ta&apos;ala
                </span>
              </p>
            </div>
          </AnimateOnMount>

          {/* CTA */}
          <AnimateOnMount delay={500}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gold text-emerald font-sans font-semibold px-8 py-3.5 rounded-xl hover:bg-gold/90 transition-colors text-base"
              >
                Daftar Sekarang
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-cream/40 text-cream font-sans font-semibold px-8 py-3.5 rounded-xl hover:bg-cream/10 transition-colors text-base"
              >
                Hubungi Panitia
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </a>
            </div>
          </AnimateOnMount>
        </div>
      </div>

      {/* Scroll indicator */}
      <AnimateOnMount delay={700}>
        <div className="relative z-10 flex justify-center pb-8 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </AnimateOnMount>
    </section>
  );
}
