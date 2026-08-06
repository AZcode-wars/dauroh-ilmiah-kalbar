"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  registerPesertaSchema,
  canonicalizeRegisterInput,
  type RegisterPesertaOutput,
} from "@/lib/validations";
import {
  KABUPATEN_KALBAR,
  JENIS_KENDARAAN,
  PANITIA_KONFIRMASI_WA,
  ABU_YUSUF,
} from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { TimeToggleField } from "@/components/register/TimeToggleField";
import { Motorbike, CarFront, TramFront } from "lucide-react";

const kendaraanIcons: Record<string, React.ReactNode> = {
  motor: <Motorbike />,
  mobil: <CarFront />,
  angkutan_umum: <TramFront />,
};

// Batas maksimal karakter keterangan — disamakan dengan rule max(500) di lib/validations.ts
const MAX_KETERANGAN_LENGTH = 500;

export function RegistrationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerPesertaSchema),
    defaultValues: {
      jenis_kelamin: "ikhwan",
      menginap: false,
      membawa_rombongan: false,
      amir_safar: null,
      driver: null,
      rombongan_ikhwan_dewasa: 0,
      rombongan_ikhwan_anak: 0,
      rombongan_akhwat_dewasa: 0,
      rombongan_akhwat_anak: 0,
      is_asatidzah: false,
      jumlah_asatidzah: 0,
      keterangan: null,
      tipe_waktu_berangkat: "jam_pasti",
      waktu_berangkat: null,
      deskripsi_berangkat: null,
      tipe_waktu_kepulangan: "jam_pasti",
      waktu_kepulangan: null,
      deskripsi_kepulangan: null,
      jenis_kendaraan: "motor",
    },
  });

  const menginap = watch("menginap");
  const membawaRombongan = watch("membawa_rombongan");
  const jenisKendaraan = watch("jenis_kendaraan");
  const isAsatidzah = watch("is_asatidzah");
  const jumlahAsatidzah = watch("jumlah_asatidzah");
  const nama = watch("nama");
  const keterangan = watch("keterangan");

  // State lokal: menandai apakah amir safar / driver diisi oleh orang lain (bukan pendaftar)
  const [amirNotSelf, setAmirNotSelf] = useState(false);
  const [driverNotSelf, setDriverNotSelf] = useState(false);

  // Fallback amir_safar = nama pendaftar selama "Bukan anda?" tidak aktif.
  // Dijaga via effect (bukan hanya saat toggle) agar nilai selalu terbaru ketika
  // nama diisi/diubah SETELAH rombongan diaktifkan — validasi wajib tetap lolos.
  useEffect(() => {
    if (membawaRombongan && !amirNotSelf) setValue("amir_safar", nama || "");
  }, [nama, amirNotSelf, membawaRombongan, setValue]);

  // Fallback driver = nama pendaftar, dengan kondisi sama + hanya kendaraan pribadi.
  useEffect(() => {
    if (
      membawaRombongan &&
      jenisKendaraan !== "angkutan_umum" &&
      !driverNotSelf
    ) {
      setValue("driver", nama || "");
    }
  }, [nama, driverNotSelf, membawaRombongan, jenisKendaraan, setValue]);

  // Handler untuk submit form
  async function onSubmit(data: RegisterPesertaOutput) {
    setSubmitting(true);

    // Normalisasi data sebelum dikirim ke server
    const payload = canonicalizeRegisterInput(data);

    try {
      const res = await fetch("/api/peserta/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        // Simpan data peserta ke sessionStorage untuk ditampilkan di halaman sukses
        sessionStorage.setItem(
          "registration_success_data",
          JSON.stringify(result.data),
        );
        router.push("/register/success");
        return;
      }

      if (res.status === 400) {
        // Tampilkan error validasi pertama sebagai toast
        const firstError =
          result.errors?.[0]?.message || "Data yang anda masukkan tidak valid";
        toast.error(firstError);
      } else if (res.status === 403) {
        toast.error("Pendaftaran sudah ditutup");
      } else if (res.status === 409) {
        toast.error("Nomor WA sudah terdaftar. Silahkan gunakan nomor lain");
      } else {
        toast.error("Terjadi kesalahan. Silahkan coba lagi");
      }
    } catch {
      toast.error("Gagal terhubung ke server. Periksa koneksi anda");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Top App Bar — fixed, sesuai Stitch design */}
      <header className="fixed top-0 w-full z-50 bg-cream h-16 flex items-center px-4 border-b border-emerald/5">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-emerald hover:opacity-80 transition-opacity"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h1 className="ml-2 font-serif text-lg font-semibold text-emerald">
          Registration
        </h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-20 pb-32 px-4 flex flex-col gap-4 max-w-lg mx-auto"
      >
        {/* Header Card */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)]">
          <h1 className="font-serif text-xl font-bold text-emerald">
            Pendaftaran Peserta
          </h1>
          <p className="font-sans text-sm text-emerald/60 mt-1">
            Dauroh Ilmiah Kalbar — 21-23 Agustus 2026
          </p>
        </section>

        {/* Deskripsi Pendaftaran */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
          <h2 className="font-serif text-3xl font-bold text-emerald text-center">
            BISMILLAH
          </h2>
          <p className="font-serif text-lg font-bold text-brown text-center leading-snug">
            Hadirilah ! DAUROH ILMIAH KALIMANTAN BARAT di Manis Raya 2026
          </p>
          <p className="font-sans text-sm text-emerald/70 leading-relaxed text-justify">
            Bagi peserta yang berasal dari luar Kabupaten Sintang, baik yang
            akan menginap maupun tidak menginap, diharapkan untuk melakukan
            registrasi terlebih dahulu melalui formulir pendaftaran berikut ini.
          </p>
          <h3 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
            Konfirmasi Pendaftaran
          </h3>
          <p className="font-sans text-sm text-emerald/70 leading-relaxed text-justify">
            Peserta yang telah melakukan pendaftaran diharapkan untuk
            mengonfirmasi pendaftarannya kepada panitia sebagai bentuk
            verifikasi data. Apabila mengalami kesulitan dalam mengisi formulir,
            silakan hubungi Panitia:
          </p>
          <p className="font-sans text-sm text-emerald/70">
            <a
              href={buildWhatsAppUrl(
                ABU_YUSUF,
                "Assalamu'alaikum, saya ingin bertanya tentang pendaftaran Dauroh Ilmiah Kalbar - Manis Raya 2026.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald font-semibold underline underline-offset-2 hover:text-gold transition-colors"
            >
              Abu Yusuf
            </a>
          </p>
          <p className="font-sans text-sm text-emerald/70">
            <a
              href={buildWhatsAppUrl(
                PANITIA_KONFIRMASI_WA,
                "Assalamu'alaikum, saya ingin bertanya tentang pendaftaran Dauroh Ilmiah Kalbar - Manis Raya 2026.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald font-semibold underline underline-offset-2 hover:text-gold transition-colors"
            >
              Ustadz Abu Zur&apos;ah
            </a>
          </p>
        </section>

        {/* Data Diri */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
          <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
            DATA DIRI
          </h2>

          <div className="space-y-1">
            <label className="font-sans text-sm font-semibold text-emerald/80">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              {...register("nama")}
              className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
            />
            {errors.nama && (
              <p className="text-danger font-sans text-xs mt-1">
                {errors.nama.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-sans text-sm font-semibold text-emerald/80">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              {...register("nomor_wa")}
              className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
            />
            <p className="text-[12px] text-emerald/60 italic mt-1">
              Mulai dengan 08 atau 628
            </p>
            {errors.nomor_wa && (
              <p className="text-danger font-sans text-xs mt-1">
                {errors.nomor_wa.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-sans text-sm font-semibold text-emerald/80">
              Asal (Kabupaten/Kota)
            </label>
            <select
              {...register("asal")}
              className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors appearance-none"
            >
              <option value="">Pilih Kabupaten/Kota</option>
              {KABUPATEN_KALBAR.map((kab) => (
                <option key={kab} value={kab}>
                  {kab}
                </option>
              ))}
            </select>
            {errors.asal && (
              <p className="text-danger font-sans text-xs mt-1">
                {errors.asal.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-sans text-sm font-semibold text-emerald/80">
              Jenis Kelamin
            </label>
            <select
              {...register("jenis_kelamin")}
              className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors appearance-none"
            >
              <option value="ikhwan">Ikhwan Dewasa</option>
              <option value="akhwat">Akhwat Dewasa</option>
            </select>
            {errors.jenis_kelamin && (
              <p className="text-danger font-sans text-xs mt-1">
                {errors.jenis_kelamin.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-sans text-sm font-semibold text-emerald/80">
              Menginap selama acara?
            </span>
            <button
              type="button"
              onClick={() => setValue("menginap", !menginap)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                menginap ? "bg-emerald" : "bg-emerald/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  menginap ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Status asatidzah pendaftar — menandai pendaftar yang termasuk asatidzah (tidak menambah headcount) */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-sans text-sm font-semibold text-emerald/80">
                Saya asatidzah
              </span>
              <p className="text-[12px] text-emerald/60 italic mt-1 max-w-72">
                Asatidzah adalah orang dewasa. Jika diaktifkan, Anda otomatis
                dihitung sebagai asatidzah (1) dan dikeluarkan dari hitungan
                Ikhwan/Akhwat Dewasa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("is_asatidzah", !isAsatidzah)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAsatidzah ? "bg-emerald" : "bg-emerald/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isAsatidzah ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Rombongan */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
          <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
            ROMBONGAN
          </h2>

          <div className="flex items-center justify-between py-2">
            <span className="font-sans text-sm font-semibold text-emerald/80">
              Saya membawa rombongan
            </span>
            <button
              type="button"
              onClick={() => setValue("membawa_rombongan", !membawaRombongan)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                membawaRombongan ? "bg-emerald" : "bg-emerald/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  membawaRombongan ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {membawaRombongan && (
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="font-sans text-sm font-semibold text-emerald/80">
                  Ikhwan: Dewasa
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("rombongan_ikhwan_dewasa")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
                {errors.rombongan_ikhwan_dewasa && (
                  <p className="text-danger font-sans text-xs mt-1">
                    {errors.rombongan_ikhwan_dewasa.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-sans text-sm font-semibold text-emerald/80">
                  Ikhwan: Anak (&lt;12 thn)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("rombongan_ikhwan_anak")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
                {errors.rombongan_ikhwan_anak && (
                  <p className="text-danger font-sans text-xs mt-1">
                    {errors.rombongan_ikhwan_anak.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-sans text-sm font-semibold text-emerald/80">
                  Akhwat: Dewasa
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("rombongan_akhwat_dewasa")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
                {errors.rombongan_akhwat_dewasa && (
                  <p className="text-danger font-sans text-xs mt-1">
                    {errors.rombongan_akhwat_dewasa.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-sans text-sm font-semibold text-emerald/80">
                  Akhwat: Anak (&lt;12 thn)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("rombongan_akhwat_anak")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
                {errors.rombongan_akhwat_anak && (
                  <p className="text-danger font-sans text-xs mt-1">
                    {errors.rombongan_akhwat_anak.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-sans text-sm font-semibold text-emerald/80">
                  Ada berapa asatidzah lain dalam rombongan? (selain Anda)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("jumlah_asatidzah")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
                <p className="text-[12px] text-emerald/60 italic mt-1">
                  Isi 0 jika tidak ada asatidzah lain dari rombongan. Jumlah
                  tidak boleh melebihi jumlah orang dewasa.
                </p>
                {isAsatidzah && (
                  <p className="text-[12px] text-emerald font-medium mt-1">
                    Total asatidzah: {1 + (Number(jumlahAsatidzah) || 0)}{" "}
                    (termasuk Anda)
                  </p>
                )}
                {errors.jumlah_asatidzah && (
                  <p className="text-danger font-sans text-xs mt-1">
                    {errors.jumlah_asatidzah.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Amir Safar — hanya relevan saat membawa rombongan */}
        {membawaRombongan && (
          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
            <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
              AMIR SAFAR
            </h2>

            <div className="flex items-center justify-between py-2">
              <span className="font-sans text-sm font-semibold text-emerald/80">
                Bukan anda?
              </span>
              <button
                type="button"
                onClick={() => setAmirNotSelf(!amirNotSelf)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  amirNotSelf ? "bg-emerald" : "bg-emerald/20"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    amirNotSelf ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-sm font-semibold text-emerald/80">
                Siapa amir safar?
              </label>
              <p className="text-[12px] text-emerald/60 italic">
                Amir safar memimpin perjalanan rombongan
              </p>
              {amirNotSelf ? (
                <input
                  type="text"
                  placeholder="Masukkan nama amir safar"
                  {...register("amir_safar")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
              ) : (
                <p className="font-sans text-sm text-emerald">
                  {nama ? `Anda — ${nama}` : "Anda"}
                </p>
              )}
              {errors.amir_safar && (
                <p className="text-danger font-sans text-xs mt-1">
                  {errors.amir_safar.message}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Driver — hanya saat rombongan & kendaraan pribadi (motor/mobil), tersembunyi saat angkutan umum */}
        {membawaRombongan && jenisKendaraan !== "angkutan_umum" && (
          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
            <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
              DRIVER
            </h2>

            <div className="flex items-center justify-between py-2">
              <span className="font-sans text-sm font-semibold text-emerald/80">
                Bukan anda?
              </span>
              <button
                type="button"
                onClick={() => setDriverNotSelf(!driverNotSelf)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  driverNotSelf ? "bg-emerald" : "bg-emerald/20"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    driverNotSelf ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-sm font-semibold text-emerald/80">
                Siapa driver?
              </label>
              <p className="text-[12px] text-emerald/60 italic">
                Driver mengendarai kendaraan rombongan
              </p>
              {driverNotSelf ? (
                <input
                  type="text"
                  placeholder="Masukkan nama driver"
                  {...register("driver")}
                  className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
                />
              ) : (
                <p className="font-sans text-sm text-emerald">
                  {nama ? `Anda — ${nama}` : "Anda"}
                </p>
              )}
              {errors.driver && (
                <p className="text-danger font-sans text-xs mt-1">
                  {errors.driver.message}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Waktu Keberangkatan */}
        <TimeToggleField
          label="WAKTU KEBERANGKATAN"
          typeField="tipe_waktu_berangkat"
          fixedField="waktu_berangkat"
          flexField="deskripsi_berangkat"
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        {/* Waktu Kepulangan */}
        <TimeToggleField
          label="WAKTU KEPULANGAN"
          typeField="tipe_waktu_kepulangan"
          fixedField="waktu_kepulangan"
          flexField="deskripsi_kepulangan"
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        {/* Kendaraan */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
          <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
            KENDARAAN
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {JENIS_KENDARAAN.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() =>
                  setValue(
                    "jenis_kendaraan",
                    k.value as "motor" | "mobil" | "angkutan_umum",
                  )
                }
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                  jenisKendaraan === k.value
                    ? "border-gold bg-gold/10"
                    : "border-emerald/20 bg-white"
                }`}
              >
                <span
                  className={
                    jenisKendaraan === k.value ? "text-gold" : "text-emerald"
                  }
                >
                  {kendaraanIcons[k.value]}
                </span>
                <span
                  className={`text-[12px] font-sans font-semibold ${
                    jenisKendaraan === k.value ? "text-emerald" : "text-emerald"
                  }`}
                >
                  {k.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Keterangan — catatan tambahan opsional */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
          <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
            KETERANGAN
          </h2>

          <div className="space-y-1">
            <textarea
              rows={3}
              maxLength={MAX_KETERANGAN_LENGTH}
              placeholder="Catatan tambahan (opsional, maksimal 500 karakter)"
              {...register("keterangan")}
              className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-danger font-sans text-xs mt-1">
                {errors.keterangan?.message}
              </p>
              <span className="text-[12px] text-emerald/60 ml-auto">
                {keterangan?.length ?? 0}/{MAX_KETERANGAN_LENGTH}
              </span>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-emerald font-sans font-bold py-4 px-8 rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {submitting ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Mendaftarkan...
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
