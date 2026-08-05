import { HeroSection } from "@/components/landing/HeroSection";
import { CountdownSection } from "@/components/landing/CountdownSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FasilitasSection } from "@/components/landing/FasilitasSection";
import { RundownSection } from "@/components/landing/RundownSection";
import { LokasiSection } from "@/components/landing/LokasiSection";
import { CTASection } from "@/components/landing/CTASection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSettings } from "@/lib/settings";
import { getAboutImages } from "@/lib/about-images";
// import { LibraryBig } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, aboutImages] = await Promise.all([
    getSettings(),
    getAboutImages(),
  ]);

  return (
    <main>
      <HeroSection contactWa={settings.contact_person_wa} />

      <ScrollReveal>
        <CountdownSection />
      </ScrollReveal>

      <ScrollReveal>
        <AboutSection images={aboutImages} />
      </ScrollReveal>

      <ScrollReveal>
        <FasilitasSection />
      </ScrollReveal>

      <ScrollReveal>
        <RundownSection />
      </ScrollReveal>

      <ScrollReveal>
        <LokasiSection />
      </ScrollReveal>

      <ScrollReveal>
        <CTASection contactWa={settings.contact_person_wa} />
      </ScrollReveal>

      <footer className="py-8 bg-emerald text-center">
        <div className="flex items-center justify-center gap-2 text-cream/60 text-sm mb-2">
          {/* <LibraryBig size={15} /> */}
          <Image
            src="/logo_dauroh.svg"
            alt="Logo Dauroh Manis Raya"
            width={15}
            height={15}
            priority
            className="shrink-0 items-center "
          />
          <span className="font-serif text-cream/80 font-semibold tracking-wide">
            Dauroh Manis Raya
          </span>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-cream/40 mb-3">
          <span>
            <a href="#fasilitas">Fasilitas</a>
          </span>
          <span>
            <a href="#rundown">Jadwal</a>
          </span>
          <span>
            <a href="#lokasi">Lokasi</a>
          </span>
          <span>
            <a href="#cta">Hubungi Kami</a>
          </span>
        </div>

        <p className="text-cream/40 font-sans text-xs">
          &copy; 2026 Azura Dev. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
