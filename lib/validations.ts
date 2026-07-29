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
  jumlah_rombongan: z.coerce.number().int().min(1).nullable(),
  tipe_waktu_berangkat: z.enum(["jam_pasti", "fleksibel"]),
  waktu_berangkat: z.string().nullable(),
  deskripsi_berangkat: z.string().trim().nullable(),
  tipe_waktu_kepulangan: z.enum(["jam_pasti", "fleksibel"]),
  waktu_kepulangan: z.string().nullable(),
  deskripsi_kepulangan: z.string().trim().nullable(),
  jenis_kendaraan: z.enum(["motor", "mobil", "angkutan_umum"]),
}).superRefine((data, ctx) => {
  // Validasi: Jika membawa rombongan, maka field jumlah rombongan wajib diisi
  if (data.membawa_rombongan && data.jumlah_rombongan === null) {
    ctx.addIssue({ code: "custom", path: ["jumlah_rombongan"], message: "Harap Jumlah Rombongan diisi terlebih dahulu!" });
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
// Mencegah data ambigu, contoh: jumlah rombongan yang diinput tapi opsi membawa rombongan = false
export function canonicalizeRegisterInput(input: RegisterPesertaInput): RegisterPesertaInput {
  return {
    ...input,
    // Jika tidak membawa rombongan, database harus menyimpan null supaya headcount tidak ambigu
    jumlah_rombongan: input.membawa_rombongan ? input.jumlah_rombongan : null,
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
