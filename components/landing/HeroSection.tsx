"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CalendarDays, MapPin } from "lucide-react";
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

          <Link href="/" className="flex gap-2 text-cream items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              fill="currentColor"
              className="w-6 h-6 shrink-0"
            >
              <path d="M 294.276 120.96 C 307.423 130.552 318.953 141.193 328.741 153.978 C 328.741 155.533 328.741 157.09 328.741 158.694 C 327.365 158.645 325.992 158.595 324.574 158.546 C 318.219 158.345 311.866 158.225 305.51 158.105 C 303.346 158.026 301.184 157.947 298.954 157.866 C 275.636 157.537 259.172 165.04 242.311 180.176 C 240.775 181.648 239.238 183.119 237.656 184.635 C 236.272 185.961 234.889 187.286 233.463 188.652 C 218.756 203.793 207.496 221.572 195.806 238.878 C 199.498 247.009 204.432 252.613 210.731 259.072 C 221.218 269.981 230.932 281.327 240.492 292.99 C 241.994 294.588 243.495 296.188 245.041 297.836 C 246.665 297.836 248.291 297.836 249.965 297.836 C 253.249 294.228 253.249 294.228 256.493 289.462 C 257.783 287.679 259.073 285.893 260.402 284.056 C 261.781 282.134 263.159 280.212 264.583 278.233 C 302.815 226.364 302.815 226.364 328.741 220.011 C 342.087 218.129 354.677 218.31 366.333 225.659 C 378.176 236.184 388.964 250.486 395.21 264.819 C 395.21 267.153 395.21 269.489 395.21 271.894 C 392.061 271.701 388.915 271.505 385.67 271.305 C 364.671 271.524 350.277 278.729 335.051 292.383 C 324.027 303.562 314.83 315.535 305.969 328.349 C 304.763 330.077 303.555 331.808 302.312 333.591 C 301.221 335.237 300.131 336.885 299.008 338.581 C 298.033 340.048 297.058 341.512 296.054 343.022 C 293.769 348.601 294.557 351.255 296.738 356.795 C 303.424 365.969 311.219 374.315 318.894 382.736 C 320.13 384.096 321.366 385.458 322.639 386.861 C 354.679 421.854 354.679 421.854 397.672 441.694 C 413.374 441.435 423.178 436.276 434.078 425.583 C 442.591 416.507 449.824 407.097 456.754 396.886 C 457.566 396.886 458.378 396.886 459.216 396.886 C 461.481 415.979 453.467 433.068 441.848 448.345 C 424.945 467.115 407.132 479.919 380.901 482.826 C 346.604 484.3 322.316 473.584 295.911 452.225 C 281.793 439.711 268.312 426.587 254.888 413.394 C 246.902 420.939 239.241 428.639 231.809 436.684 C 228.018 440.716 224.224 444.746 220.423 448.769 C 218.943 450.347 217.466 451.925 215.942 453.55 C 202.506 467.231 185.985 478.242 165.98 479.846 C 116.903 481.119 116.903 481.119 94.872 469.994 C 92.763 468.995 90.653 467.995 88.477 466.964 C 67.751 456.212 51.048 440.43 42.407 419.144 C 34.349 391.786 39.492 366.942 53.224 342.093 C 56.25 336.949 59.312 331.829 62.408 326.725 C 64.064 323.945 65.714 321.162 67.364 318.377 C 71.574 311.295 75.826 304.237 80.099 297.187 C 82.455 293.299 84.801 289.405 87.147 285.509 C 97.014 269.126 107.002 252.813 117.028 236.519 C 119.801 231.996 122.574 227.472 125.347 222.949 C 131.946 212.193 138.596 201.465 145.26 190.744 C 148.974 184.728 152.628 178.679 156.272 172.623 C 173.363 144.532 190.129 123.632 222.885 111.527 C 248.408 105.483 271.544 108.252 294.276 120.96 Z M 156.416 300.195 C 154.873 302.867 154.873 302.867 153.301 305.59 C 149.398 312.345 145.494 319.094 141.587 325.846 C 139.913 328.739 138.239 331.633 136.567 334.529 C 126.483 351.99 116.248 369.327 105.581 386.469 C 99.73 396.506 98.977 404.36 99.796 415.753 C 104.564 426.41 112.146 432.707 121.952 439.336 C 133.844 442.973 142.453 441.386 153.954 436.978 C 160.368 432.221 160.368 432.221 166.264 425.186 C 167.672 423.639 169.083 422.092 170.533 420.498 C 181.279 408.248 190.722 395.257 199.806 381.852 C 200.943 380.224 202.083 378.597 203.255 376.921 C 206.804 371.746 206.804 371.746 210.576 363.87 C 207.882 356.587 203.191 351.135 198.065 345.243 C 196.581 343.528 195.099 341.814 193.57 340.048 C 192.021 338.276 190.476 336.508 188.882 334.685 C 187.363 332.935 185.845 331.183 184.279 329.378 C 181.308 325.955 178.33 322.535 175.346 319.12 C 172.686 316.066 170.046 313.003 167.423 309.92 C 164.626 306.637 161.761 303.409 158.878 300.195 C 158.066 300.195 157.254 300.195 156.416 300.195 Z" />
              <path d="M 247.503 12.477 C 248.315 12.477 249.127 12.477 249.965 12.477 C 250.476 15.159 250.986 17.84 251.513 20.602 C 258.886 56.939 271.13 84.987 299.2 111.527 C 301.044 113.296 302.887 115.067 304.789 116.89 C 306.896 118.904 306.896 118.904 309.047 120.96 C 294.276 116.244 294.276 116.244 289.488 114.437 C 263.196 104.959 232.717 103.363 206.576 114.208 C 200.729 116.244 200.729 116.244 193.344 113.885 C 195.832 112.086 198.318 110.286 200.884 108.433 C 229.889 84.463 240.905 47.218 247.503 12.477 Z" />
            </svg>

            <span className="font-serif font-semibold text-lg tracking-wide ">
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
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              fill="currentColor"
              className="w-6 h-6 shrink-0"
            >
              <path d="M 294.276 120.96 C 307.423 130.552 318.953 141.193 328.741 153.978 C 328.741 155.533 328.741 157.09 328.741 158.694 C 327.365 158.645 325.992 158.595 324.574 158.546 C 318.219 158.345 311.866 158.225 305.51 158.105 C 303.346 158.026 301.184 157.947 298.954 157.866 C 275.636 157.537 259.172 165.04 242.311 180.176 C 240.775 181.648 239.238 183.119 237.656 184.635 C 236.272 185.961 234.889 187.286 233.463 188.652 C 218.756 203.793 207.496 221.572 195.806 238.878 C 199.498 247.009 204.432 252.613 210.731 259.072 C 221.218 269.981 230.932 281.327 240.492 292.99 C 241.994 294.588 243.495 296.188 245.041 297.836 C 246.665 297.836 248.291 297.836 249.965 297.836 C 253.249 294.228 253.249 294.228 256.493 289.462 C 257.783 287.679 259.073 285.893 260.402 284.056 C 261.781 282.134 263.159 280.212 264.583 278.233 C 302.815 226.364 302.815 226.364 328.741 220.011 C 342.087 218.129 354.677 218.31 366.333 225.659 C 378.176 236.184 388.964 250.486 395.21 264.819 C 395.21 267.153 395.21 269.489 395.21 271.894 C 392.061 271.701 388.915 271.505 385.67 271.305 C 364.671 271.524 350.277 278.729 335.051 292.383 C 324.027 303.562 314.83 315.535 305.969 328.349 C 304.763 330.077 303.555 331.808 302.312 333.591 C 301.221 335.237 300.131 336.885 299.008 338.581 C 298.033 340.048 297.058 341.512 296.054 343.022 C 293.769 348.601 294.557 351.255 296.738 356.795 C 303.424 365.969 311.219 374.315 318.894 382.736 C 320.13 384.096 321.366 385.458 322.639 386.861 C 354.679 421.854 354.679 421.854 397.672 441.694 C 413.374 441.435 423.178 436.276 434.078 425.583 C 442.591 416.507 449.824 407.097 456.754 396.886 C 457.566 396.886 458.378 396.886 459.216 396.886 C 461.481 415.979 453.467 433.068 441.848 448.345 C 424.945 467.115 407.132 479.919 380.901 482.826 C 346.604 484.3 322.316 473.584 295.911 452.225 C 281.793 439.711 268.312 426.587 254.888 413.394 C 246.902 420.939 239.241 428.639 231.809 436.684 C 228.018 440.716 224.224 444.746 220.423 448.769 C 218.943 450.347 217.466 451.925 215.942 453.55 C 202.506 467.231 185.985 478.242 165.98 479.846 C 116.903 481.119 116.903 481.119 94.872 469.994 C 92.763 468.995 90.653 467.995 88.477 466.964 C 67.751 456.212 51.048 440.43 42.407 419.144 C 34.349 391.786 39.492 366.942 53.224 342.093 C 56.25 336.949 59.312 331.829 62.408 326.725 C 64.064 323.945 65.714 321.162 67.364 318.377 C 71.574 311.295 75.826 304.237 80.099 297.187 C 82.455 293.299 84.801 289.405 87.147 285.509 C 97.014 269.126 107.002 252.813 117.028 236.519 C 119.801 231.996 122.574 227.472 125.347 222.949 C 131.946 212.193 138.596 201.465 145.26 190.744 C 148.974 184.728 152.628 178.679 156.272 172.623 C 173.363 144.532 190.129 123.632 222.885 111.527 C 248.408 105.483 271.544 108.252 294.276 120.96 Z M 156.416 300.195 C 154.873 302.867 154.873 302.867 153.301 305.59 C 149.398 312.345 145.494 319.094 141.587 325.846 C 139.913 328.739 138.239 331.633 136.567 334.529 C 126.483 351.99 116.248 369.327 105.581 386.469 C 99.73 396.506 98.977 404.36 99.796 415.753 C 104.564 426.41 112.146 432.707 121.952 439.336 C 133.844 442.973 142.453 441.386 153.954 436.978 C 160.368 432.221 160.368 432.221 166.264 425.186 C 167.672 423.639 169.083 422.092 170.533 420.498 C 181.279 408.248 190.722 395.257 199.806 381.852 C 200.943 380.224 202.083 378.597 203.255 376.921 C 206.804 371.746 206.804 371.746 210.576 363.87 C 207.882 356.587 203.191 351.135 198.065 345.243 C 196.581 343.528 195.099 341.814 193.57 340.048 C 192.021 338.276 190.476 336.508 188.882 334.685 C 187.363 332.935 185.845 331.183 184.279 329.378 C 181.308 325.955 178.33 322.535 175.346 319.12 C 172.686 316.066 170.046 313.003 167.423 309.92 C 164.626 306.637 161.761 303.409 158.878 300.195 C 158.066 300.195 157.254 300.195 156.416 300.195 Z" />
              <path d="M 247.503 12.477 C 248.315 12.477 249.127 12.477 249.965 12.477 C 250.476 15.159 250.986 17.84 251.513 20.602 C 258.886 56.939 271.13 84.987 299.2 111.527 C 301.044 113.296 302.887 115.067 304.789 116.89 C 306.896 118.904 306.896 118.904 309.047 120.96 C 294.276 116.244 294.276 116.244 289.488 114.437 C 263.196 104.959 232.717 103.363 206.576 114.208 C 200.729 116.244 200.729 116.244 193.344 113.885 C 195.832 112.086 198.318 110.286 200.884 108.433 C 229.889 84.463 240.905 47.218 247.503 12.477 Z" />
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
              Transaksi Syariah Tanpa Riba di Era Digital
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
                Al-Ustadz{" "}
                <span className="text-cream/90 font-semibold">
                  Qomar Z.A, Lc.
                </span>{" "}
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
