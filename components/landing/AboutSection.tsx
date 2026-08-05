import { AboutImageGallery } from "@/components/landing/AboutImageGallery";
import type { AboutImage } from "@/types/about-image";

type AboutSectionProps = {
  images: AboutImage[];
};

export function AboutSection({ images }: AboutSectionProps) {
  return (
    <section className="py-12 md:py-20 px-4">
      <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-3 text-center">
        Tentang Dauroh
      </p>

      <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug mb-6 text-center">
        Dauroh Ilmiah <span className="text-brown">Kalimantan Barat</span>
      </h2>
      <div className="max-w-5xl mx-auto md:gap-12 items-center">
        <div className="bg-white rounded-2xl grid md:grid-cols-2 gap-8 p-8 md:p-10 shadow-[0_4px_20px_rgba(0,53,39,0.08)]">
          <div className="text">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug mb-6 ">
              Transaksi Syariah Tanpa Riba{" "}
              <span className="text-brown">di Era Digital</span>
            </h2>
            <p className="text-emerald/70 font-sans text-lg leading-9 my-auto text-justify">
              Sebuah sarana ilmiah untuk memahami fikih muamalah, menjaga harta
              dari jerat riba, serta meluruskan transaksi di era modern sesuai
              syariat Islam. <br /> <br />{" "}
              <em>
                &quot;Janganlah seseorang berdagang di pasar kami kecuali ia
                memahami fikih muamalah. Jika tidak, ia akan terjatuh memakan
                riba.&quot; — Ucapan Umar bin Khattab radhiyallahu &apos;anhu
                (Mughni al-Muhtaj, Al-Khathib Asy-Syirbini)
              </em>
            </p>
          </div>
          <AboutImageGallery images={images} />
        </div>
      </div>
    </section>
  );
}
