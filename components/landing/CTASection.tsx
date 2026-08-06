import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { RegisterLoadingLink } from "@/components/register/RegisterLoadingLink";

interface CTASectionProps {
  contactWa: string;
}

export function CTASection({ contactWa }: CTASectionProps) {
  const waUrl = buildWhatsAppUrl(
    contactWa,
    "Assalamu'alaikum, saya ingin bertanya tentang Dauroh Ilmiah Kalbar yang diadakan di Sintang, Manis Raya...",
  );

  return (
    <section id="cta" className="py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-linear-to-br from-emerald to-emerald-soft rounded-3xl p-10 md:p-16 shadow-[0_8px_40px_rgba(0,53,39,0.15)]">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream leading-snug mb-5">
            Siap mengikuti{" "}
            <span className="text-gold">Dauroh Ilmiah Kalbar</span>?
          </h2>

          <p className="text-cream/70 font-sans text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Jangan tunda lagi. Daftarkan diri, keluarga, dan rombongan Anda
            sekarang juga untuk mendapatkan pengalaman belajar bersama asatidzah
            kibar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RegisterLoadingLink
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gold text-emerald font-sans font-semibold px-8 py-3.5 rounded-xl hover:bg-gold/90 transition-colors text-base"
            >
              Daftar Sekarang
            </RegisterLoadingLink>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-cream/30 text-cream font-sans font-semibold px-8 py-3.5 rounded-xl hover:bg-cream/10 transition-colors text-base"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Tanya Panitia
            </a>
          </div>

          <p className="text-cream/50 font-sans text-sm mt-6">
            * Pendaftaran akan ditutup otomatis jika sudah melebihi batas waktu
            yang ditentukan.
          </p>
        </div>
      </div>
    </section>
  );
}
