"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  registerPesertaSchema,
  canonicalizeRegisterInput,
  type RegisterPesertaOutput,
} from "@/lib/validations";
import { KABUPATEN_KALBAR, JENIS_KENDARAAN } from "@/lib/constants";
import { TimeToggleField } from "@/components/register/TimeToggleField";
import { Motorbike, CarFront, TramFront } from "lucide-react";

const kendaraanIcons: Record<string, React.ReactNode> = {
  motor: <Motorbike />,
  mobil: <CarFront />,
  angkutan_umum: <TramFront />,
};

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
      menginap: false,
      membawa_rombongan: false,
      jumlah_rombongan: null,
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
            <div className="space-y-1">
              <label className="font-sans text-sm font-semibold text-emerald/80">
                Jumlah Rombongan
              </label>
              <input
                type="number"
                placeholder="Jumlah orang"
                {...register("jumlah_rombongan")}
                className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
              />
              {errors.jumlah_rombongan && (
                <p className="text-danger font-sans text-xs mt-1">
                  {errors.jumlah_rombongan.message}
                </p>
              )}
            </div>
          )}
        </section>

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
