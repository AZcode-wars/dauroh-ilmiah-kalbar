// Daftar kabupaten dan kota di Kalimantan Barat yang menjadi pilihan asal peserta
export const KABUPATEN_KALBAR = [
  "Kubu Raya",
  "Pontianak",
  "Sambas",
  "Sanggau",
  "Sekadau",
  "Sintang",
  "Kapuas Hulu",
  "Mempawah",
  "Landak",
  "Bengkayang",
  "Singkawang",
  "Kota Pontianak",
  "Kota Singkawang",
] as const;

// Pilihan jenis kendaraan yang digunakan peserta
export const JENIS_KENDARAAN = [
  { value: "motor", label: "Motor" },
  { value: "mobil", label: "Mobil" },
  { value: "angkutan_umum", label: "Angkutan Umum" },
] as const;

// Nomor WhatsApp panitia untuk konfirmasi pendaftaran
export const PANITIA_KONFIRMASI_WA = "082254655476";

// Nama cookie untuk session admin
export const ADMIN_SESSION_COOKIE = "admin_session";
