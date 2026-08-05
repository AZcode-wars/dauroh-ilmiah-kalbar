"use client";

import { Map, MapPinned } from "lucide-react";

export function LokasiSection() {
  return (
    <section id="lokasi" className="py-12 md:py-20 bg-cream-muted/50 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Lokasi
          </p>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug">
            Tempat Penyelenggaraan
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,53,39,0.08)]">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald/5 text-emerald mb-5">
                <MapPinned className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-emerald mb-3">
                Pondok Pesantren Darul Muwahhidin
              </h3>

              <p className="text-emerald/60 font-sans leading-8 mb-4">
                X5MF+F5H, Dusun Lepung kedang Desa, RT./Rw/RW.018/009, Manis
                Raya, Kec. Sepauk, Kabupaten Sintang, Kalimantan Barat 78662,
                Indonesia
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.app.goo.gl/yRQUzy9ZtdR2274PA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald text-cream font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-soft transition-colors text-sm"
                >
                  <Map size={15} />
                  Buka di Google Maps
                </a>
              </div>
            </div>

            <div className="w-full md:w-80 h-64 md:h-auto rounded-xl overflow-hidden bg-emerald/5 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJOcaJFRP-AS4RNLUYxvpJA1Q&key=AIzaSyBQm4vEy6_sjY3NOEZNLCzr6xAAKUrjGz8"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Dauroh Manis Raya"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
