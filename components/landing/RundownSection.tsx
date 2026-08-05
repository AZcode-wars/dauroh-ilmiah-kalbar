import { ArrowUpRight } from "lucide-react";
const jadwal = [
  {
    sesi: 1,
    waktu: "Bakda Asar",
    tanggal: "Jumat, 21 Agustus 2026",
    judul: "Tausiyah Umum",
    desc: "Tausiyah umum sebelum memasuki tema inti.",
  },
  {
    sesi: 2,
    waktu: "Bakda Isya",
    tanggal: "Jumat, 21 Agustus 2026",
    judul: "Kajian Intensif",
    desc: "Kajian intensif mendalami materi tema dauroh dan tanya jawab.",
  },
  {
    sesi: 3,
    waktu: "Bakda Subuh",
    tanggal: "Sabtu, 22 Agustus 2026",
    judul: "Kajian Intensif",
    desc: "Kajian intensif sesi lanjutan dengan pendalaman materi dan tanya jawab.",
  },
  {
    sesi: 4,
    waktu: "Pukul 10.00",
    tanggal: "Sabtu, 22 Agustus 2026",
    judul: "Kajian Intensif",
    desc: "Kajian intensif sesi lanjutan dengan pendalaman materi dan tanya jawab.",
  },
  {
    sesi: 5,
    waktu: "Bakda Asar",
    tanggal: "Sabtu, 22 Agustus 2026",
    judul: "Kajian Intensif",
    desc: "Kajian intensif sesi sore dengan pendalaman materi dan tanya jawab.",
  },
  {
    sesi: 6,
    waktu: "Bakda Isya",
    tanggal: "Sabtu, 22 Agustus 2026",
    judul: "Kajian Intensif",
    desc: "Kajian intensif sesi malam dan dan tanya jawab.",
  },
  {
    sesi: 7,
    waktu: "Bakda Subuh",
    tanggal: "Ahad, 23 Agustus 2026",
    judul: "Tanya Jawab",
    desc: "Sesi tanya jawab dan penutupan dauroh.",
  },
];

export function RundownSection() {
  return (
    <section id="rundown" className="py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Rangkaian Acara
          </p>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-emerald leading-snug">
            Jadwal Dauroh
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-emerald/20" />

          <div className="space-y-12">
            <div className="relative pl-14">
              <div className="absolute left-[11px] top-1 w-[25px] h-[25px] rounded-full bg-emerald border-4 border-cream" />

              <p className="text-emerald/50 font-sans text-sm mb-2">
                Jumat, 21 Agustus 2026
              </p>

              <h3 className="font-serif text-xl font-semibold text-emerald mb-2">
                Khutbah Jumat
              </h3>

              <p className="text-emerald/60 font-sans leading-relaxed">
                Khutbah Jumat di Masjid Besar Al Falah Sekadau
              </p>
              <p className="text-emerald/60 font-sans leading-relaxed mt-3 flex items-center gap-1">
                <a
                  href="https://maps.app.goo.gl/whCyR6hi78hGXHii6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald hover:underline"
                >
                  Lihat di Google Maps
                  <ArrowUpRight className="w-4 h-4 inline-block items-center ml-1" />
                </a>
              </p>
            </div>
            {jadwal.map((item) => (
              <div key={item.sesi} className="relative pl-14">
                <div className="absolute left-[11px] top-1 w-[25px] h-[25px] rounded-full bg-emerald border-4 border-cream" />

                <p className="text-brown/60 font-sans text-sm font-semibold tracking-wider uppercase mb-1">
                  Sesi {item.sesi}
                </p>

                <p className="text-emerald/50 font-sans text-sm mb-2">
                  {item.waktu}
                </p>

                <p className="text-emerald/50 font-sans text-sm mb-2">
                  {item.tanggal}
                </p>

                <h3 className="font-serif text-xl font-semibold text-emerald mb-2">
                  {item.judul}
                </h3>

                <p className="text-emerald/60 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
