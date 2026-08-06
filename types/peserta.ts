export type JenisKendaraan = "motor" | "mobil" | "angkutan_umum";

export type TipeWaktu = "jam_pasti" | "fleksibel";

// Mendefinisikan tipe data untuk peserta yang digunakan di seluruh aplikasi
export type Peserta = {
  id: string;
  nama: string;
  nomor_wa: string;
  menginap: boolean;
  asal: string;
  membawa_rombongan: boolean;
  nomor_kendaraan: string | null;
  amir_safar: string | null;
  driver: string | null;
  rombongan_ikhwan_dewasa: number;
  rombongan_ikhwan_anak: number;
  rombongan_akhwat_dewasa: number;
  rombongan_akhwat_anak: number;
  is_asatidzah: boolean;
  jumlah_asatidzah: number;
  keterangan: string | null;
  tipe_waktu_berangkat: TipeWaktu;
  waktu_berangkat: string | null;
  deskripsi_berangkat: string | null;
  tipe_waktu_kepulangan: TipeWaktu;
  waktu_kepulangan: string | null;
  deskripsi_kepulangan: string | null;
  jenis_kendaraan: JenisKendaraan;
  is_hadir: boolean;
  hadir_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
