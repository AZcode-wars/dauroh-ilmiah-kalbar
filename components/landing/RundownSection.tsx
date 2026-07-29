const jadwal = [
  {
    hari: 1,
    tanggal: "Jumat, 21 Agustus 2026",
    judul: "Kedatangan & Pembukaan",
    desc: "Registrasi ulang, pembagian kamar, dan pembukaan resmi oleh asatidzah utama.",
  },
  {
    hari: 2,
    tanggal: "Sabtu, 22 Agustus 2026",
    judul: "Kajian Utama & Kegiatan Bersama",
    desc: "Sesi materi intensif, diskusi kelompok, kegiatan outbound ringan, dan Qiyamul Lail.",
  },
  {
    hari: 3,
    tanggal: "Minggu, 23 Agustus 2026",
    judul: "Penutupan & Kepulangan",
    desc: "Sesi kesimpulan, ramah tamah akhir, dan persiapan kepulangan peserta.",
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
            {jadwal.map((item) => (
              <div key={item.hari} className="relative pl-14">
                <div className="absolute left-[11px] top-1 w-[25px] h-[25px] rounded-full bg-emerald border-4 border-cream" />

                <p className="text-brown/60 font-sans text-sm font-semibold tracking-wider uppercase mb-1">
                  Hari {item.hari}
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
