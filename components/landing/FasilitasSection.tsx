import { Utensils, BedDouble, SquareParking, Hamburger } from "lucide-react";
const fasilitas = [
  {
    icon: <Utensils className="w-8 h-8" />,
    title: "Konsumsi Gratis",
    desc: "Hidangan gratis 3x sehari selama acara berlangsung.",
  },
  {
    icon: <BedDouble className="w-8 h-8" />,
    title: "Penginapan Pondok",
    desc: "Fasilitas menginap tersedia untuk peserta.",
  },
  {
    icon: <SquareParking className="w-8 h-8" />,
    title: "Area Parkir",
    desc: "Area parkir untuk motor dan mobil peserta.",
  },
  {
    icon: <Hamburger className="w-8 h-8" />,
    title: "Snack dan Kopi",
    desc: "Tersedia snack dan kopi selama acara berlangsung.",
  },
];

export function FasilitasSection() {
  return (
    <section id="fasilitas" className="py-12 md:py-20 bg-cream-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Fasilitas
          </p>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug">
            Nyaman &amp; Lengkap
          </h2>

          <p className="text-emerald/60 font-sans mt-3">
            Prioritas kami adalah kekhusyukan dan kenyamanan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fasilitas.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(0,53,39,0.08)] hover:shadow-[0_8px_30px_rgba(0,53,39,0.12)] transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald/5 text-emerald mb-5">
                {item.icon}
              </div>

              <h3 className="font-serif text-xl font-semibold text-emerald mb-2">
                {item.title}
              </h3>

              <p className="text-emerald/60 font-sans text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
