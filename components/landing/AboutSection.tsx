import Image from "next/image";

export function AboutSection() {
  return (
    <section className="py-12 md:py-20 px-4">
      <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-3 text-center">
        Tentang Dauroh
      </p>

      <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug mb-6 text-center">
        Membangun Jiwa, <span className="text-brown">Mempererat Ukhuwah</span>
      </h2>
      <div className="max-w-5xl mx-auto md:gap-12 items-center">
        <div className="bg-white rounded-2xl grid md:grid-cols-2 gap-8 p-8 md:p-10 shadow-[0_4px_20px_rgba(0,53,39,0.08)]">
          <div className="text">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug mb-6 ">
              Event Rutinan, <span className="text-brown">Setahun Sekali</span>
            </h2>
            <p className="text-emerald/70 font-sans text-lg leading-9 my-auto text-justify">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo.
            </p>
          </div>
          <Image
            src="/images/about-poster.jfif"
            alt="Poster Kajian Muslimah"
            width={736}
            height={920}
            className="max-w-full h-auto rounded-2xl  "
            priority
          />
        </div>
      </div>
    </section>
  );
}
