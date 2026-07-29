const fasilitas = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Konsumsi",
    desc: "Hidangan sehat 3x sehari selama acara berlangsung.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    title: "Penginapan Pondok",
    desc: "Fasilitas asrama bersih dan sejuk khas pondok.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    title: "Area Parkir",
    desc: "Parkir luas untuk motor dan mobil pribadi.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: "Bantuan Panitia",
    desc: "Siap melayani kebutuhan peserta 24 jam.",
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
