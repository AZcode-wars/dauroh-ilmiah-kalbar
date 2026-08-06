import { z } from "zod";
import { KABUPATEN_KALBAR } from "@/lib/constants";

// Regex untuk memvalidasi format nomor WhatsApp Indonesia (dimulai dengan 08 atau 628)
const nomorWaSchema = z.string().regex(/^(08|628)[0-9]{8,13}$/, "Nomor Whatsapp Tidak Valid!");

// Skema validasi utama untuk pendaftaran peserta menggunakan Zod
export const registerPesertaSchema = z.object({
  nama: z.string().trim().min(1, "Harap Nama Lengkap diisi terlebih dahulu!"),
  nomor_wa: nomorWaSchema,
  menginap: z.boolean(),
  asal: z.enum(KABUPATEN_KALBAR, { message: "Harap Asal diisi terlebih dahulu!" }),
  membawa_rombongan: z.boolean(),
  amir_safar: z.string().trim().max(100).nullable(),
  driver: z.string().trim().max(100).nullable(),
  rombongan_ikhwan_dewasa: z.coerce.number().int().min(0).max(100),
  rombongan_ikhwan_anak: z.coerce.number().int().min(0).max(100),
  rombongan_akhwat_dewasa: z.coerce.number().int().min(0).max(100),
  rombongan_akhwat_anak: z.coerce.number().int().min(0).max(100),
  is_asatidzah: z.boolean(),
  jumlah_asatidzah: z.coerce.number().int().min(0).max(100),
  keterangan: z.string().trim().max(500).nullable(),
  tipe_waktu_berangkat: z.enum(["jam_pasti", "fleksibel"]),
  waktu_berangkat: z.string().nullable(),
  deskripsi_berangkat: z.string().trim().nullable(),
  tipe_waktu_kepulangan: z.enum(["jam_pasti", "fleksibel"]),
  waktu_kepulangan: z.string().nullable(),
  deskripsi_kepulangan: z.string().trim().nullable(),
  jenis_kendaraan: z.enum(["motor", "mobil", "angkutan_umum"]),
}).superRefine((data, ctx) => {
  // Validasi: Jika membawa rombongan, Amir Safar wajib diisi
  if (data.membawa_rombongan && !data.amir_safar) {
    ctx.addIssue({ code: "custom", path: ["amir_safar"], message: "Harap Amir Safar diisi terlebih dahulu!" });
  }

  // Validasi: Driver wajib untuk kendaraan pribadi (motor/mobil) saat membawa rombongan
  if (data.membawa_rombongan && data.jenis_kendaraan !== "angkutan_umum" && !data.driver) {
    ctx.addIssue({ code: "custom", path: ["driver"], message: "Harap Driver diisi terlebih dahulu!" });
  }

  // Validasi: Saat membawa rombongan, minimal satu rincian rombongan harus lebih dari 0
  const totalRombongan =
    data.rombongan_ikhwan_dewasa + data.rombongan_ikhwan_anak + data.rombongan_akhwat_dewasa + data.rombongan_akhwat_anak;
  if (data.membawa_rombongan && totalRombongan <= 0) {
    ctx.addIssue({ code: "custom", path: ["rombongan_ikhwan_dewasa"], message: "Harap rincian rombongan diisi terlebih dahulu!" });
  }

  // Validasi: Asatidzah adalah subset dari orang dewasa dalam rombongan (tidak menambah headcount)
  if (data.jumlah_asatidzah > data.rombongan_ikhwan_dewasa + data.rombongan_akhwat_dewasa) {
    ctx.addIssue({ code: "custom", path: ["jumlah_asatidzah"], message: "Jumlah asatidzah tidak boleh melebihi jumlah dewasa" });
  }

  // Validasi: Jika tidak membawa rombongan, semua rincian rombongan dan asatidzah harus 0 agar headcount tidak ambigu
  if (!data.membawa_rombongan) {
    if (
      data.rombongan_ikhwan_dewasa !== 0 ||
      data.rombongan_ikhwan_anak !== 0 ||
      data.rombongan_akhwat_dewasa !== 0 ||
      data.rombongan_akhwat_anak !== 0
    ) {
      ctx.addIssue({ code: "custom", path: ["rombongan_ikhwan_dewasa"], message: "Rincian rombongan harus 0 jika tidak membawa rombongan" });
    }
    if (data.jumlah_asatidzah !== 0) {
      ctx.addIssue({ code: "custom", path: ["jumlah_asatidzah"], message: "Jumlah asatidzah harus 0 jika tidak membawa rombongan" });
    }
  }

  // Validasi: Berdasarkan tipe yang dipilih, periksa field waktu keberangkatan yang sesuai
  if (data.tipe_waktu_berangkat === "jam_pasti" && !data.waktu_berangkat) {
    ctx.addIssue({ code: "custom", path: ["waktu_berangkat"], message: "Harap Waktu Berangkat diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_berangkat === "fleksibel" && !data.deskripsi_berangkat) {
    ctx.addIssue({ code: "custom", path: ["deskripsi_berangkat"], message: "Harap Deskripsi Waktu Berangkat diisi terlebih dahulu!" });
  }

  // Validasi: Berdasarkan tipe yang dipilih, periksa field waktu kepulangan yang sesuai
  if (data.tipe_waktu_kepulangan === "jam_pasti" && !data.waktu_kepulangan) {
    ctx.addIssue({ code: "custom", path: ["waktu_kepulangan"], message: "Harap Waktu Kepulangan diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_kepulangan === "fleksibel" && !data.deskripsi_kepulangan) {
    ctx.addIssue({ code: "custom", path: ["deskripsi_kepulangan"], message: "Harap Deskripsi Waktu Kepulangan diisi terlebih dahulu!" });
  }
});

// Tipe data output setelah divalidasi dan ditransformasi Zod — untuk canonicalizer, API, dan handler submit
export type RegisterPesertaInput = z.infer<typeof registerPesertaSchema>;
// Tipe data mentah dari form (sebelum transformasi Zod) — untuk useForm generic
export type RegisterPesertaFormValues = z.input<typeof registerPesertaSchema>;
// Tipe data yang diterima handleSubmit setelah Zod menghasilkan output
export type RegisterPesertaOutput = z.output<typeof registerPesertaSchema>;

// Fungsi untuk menormalisasi data dari input user sebelum dimasukkan ke database
// Mencegah data ambigu, contoh: rincian rombongan yang diinput tapi opsi membawa rombongan = false
export function canonicalizeRegisterInput(input: RegisterPesertaInput): RegisterPesertaInput {
  return {
    ...input,
    // Jika tidak membawa rombongan, amir_safar dan driver disimpan null supaya headcount tidak ambigu
    amir_safar: input.membawa_rombongan ? input.amir_safar : null,
    // Driver hanya relevan untuk kendaraan pribadi (motor/mobil) saat membawa rombongan
    driver: input.membawa_rombongan && input.jenis_kendaraan !== "angkutan_umum" ? input.driver : null,
    // Jika tidak membawa rombongan, semua rincian rombongan dan asatidzah dipaksa 0
    rombongan_ikhwan_dewasa: input.membawa_rombongan ? input.rombongan_ikhwan_dewasa : 0,
    rombongan_ikhwan_anak: input.membawa_rombongan ? input.rombongan_ikhwan_anak : 0,
    rombongan_akhwat_dewasa: input.membawa_rombongan ? input.rombongan_akhwat_dewasa : 0,
    rombongan_akhwat_anak: input.membawa_rombongan ? input.rombongan_akhwat_anak : 0,
    jumlah_asatidzah: input.membawa_rombongan ? input.jumlah_asatidzah : 0,
    // Keterangan kosong disimpan null agar tidak ada string kosong di database
    keterangan: input.keterangan ? input.keterangan : null,
    // Jika user memilih jam pasti, field deskripsi harus dikosongkan agar UI/dashboard tidak menampilkan data ganda
    deskripsi_berangkat: input.tipe_waktu_berangkat === "jam_pasti" ? null : input.deskripsi_berangkat,
    waktu_berangkat: input.tipe_waktu_berangkat === "fleksibel" ? null : input.waktu_berangkat,
    deskripsi_kepulangan: input.tipe_waktu_kepulangan === "jam_pasti" ? null : input.deskripsi_kepulangan,
    waktu_kepulangan: input.tipe_waktu_kepulangan === "fleksibel" ? null : input.waktu_kepulangan,
  };
}

// Skema untuk memvalidasi pembaruan pengaturan dari dashboard admin
export const updateSettingsSchema = z.object({
  registration_open_at: z.string().datetime(),
  registration_close_at: z.string().datetime(),
  contact_person_wa: nomorWaSchema,
}).refine((data) => new Date(data.registration_close_at) > new Date(data.registration_open_at), {
  // Validasi untuk memastikan waktu tutup logic-nya selalu setelah waktu buka
  path: ["registration_close_at"],
  message: "Waktu tutup harus setelah waktu buka pendaftaran",
});

// Skema untuk memvalidasi urutan ulang gambar galeri About dari dashboard admin
export const reorderAboutImagesSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Urutan gambar wajib diisi"),
});
