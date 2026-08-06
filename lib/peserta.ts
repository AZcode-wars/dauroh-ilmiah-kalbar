import { supabaseAdmin } from "@/lib/supabase/server";
import type { JenisKendaraan, Peserta } from "@/types/peserta";
import type { RegisterPesertaInput } from "@/lib/validations";
import { getPesertaHeadcount } from "@/lib/headcount";

export type PesertaFilters = {
  search?: string;
  asal?: string;
  menginap?: "true" | "false";
  kendaraan?: "motor" | "mobil" | "angkutan_umum";
  rombongan?: "true" | "false";
};

export async function checkDuplicateWa(nomorWa: string): Promise<boolean> {
  const { count } = await supabaseAdmin
    .from("peserta")
    .select("id", { count: "exact", head: true })
    .eq("nomor_wa", nomorWa)
    .eq("is_deleted", false);

  return (count ?? 0) > 0;
}

// Membuat nomor kendaraan otomatis per (asal, jenis_kendaraan).
// Format: {slug-asal}-{kendaraan}-{nomor 2 digit}, contoh: sintang-motor-01.
// Angkutan umum tidak memakai nomor kendaraan, sehingga dikembalikan null.
export async function generateNomorKendaraan(
  asal: string,
  jenisKendaraan: JenisKendaraan
): Promise<string | null> {
  if (jenisKendaraan === "angkutan_umum") {
    return null;
  }

  // Hitung jumlah peserta aktif dengan asal & kendaraan yang sama,
  // lalu urutan berikutnya = count + 1 (pola count "exact" seperti checkDuplicateWa).
  const { count, error } = await supabaseAdmin
    .from("peserta")
    .select("id", { count: "exact", head: true })
    .eq("asal", asal)
    .eq("jenis_kendaraan", jenisKendaraan)
    .eq("is_deleted", false);

  if (error) throw error;

  const slugAsal = asal.toLowerCase().replace(/\s+/g, "-");
  const nomor = String((count ?? 0) + 1).padStart(2, "0");

  return `${slugAsal}-${jenisKendaraan}-${nomor}`;
}

export async function createPeserta(
  input: RegisterPesertaInput,
  nomorKendaraan: string | null
): Promise<Peserta> {
  const { data, error } = await supabaseAdmin
    .from("peserta")
    .insert({ ...input, nomor_kendaraan: nomorKendaraan })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActivePeserta(filters: PesertaFilters): Promise<Peserta[]> {
  let query = supabaseAdmin.from("peserta").select("*").eq("is_deleted", false);

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(`nama.ilike.${searchTerm},nomor_wa.ilike.${searchTerm}`);
  }

  if (filters.asal) {
    query = query.eq("asal", filters.asal);
  }

  if (filters.menginap) {
    query = query.eq("menginap", filters.menginap === "true");
  }

  if (filters.kendaraan) {
    query = query.eq("jenis_kendaraan", filters.kendaraan);
  }

  if (filters.rombongan) {
    query = query.eq("membawa_rombongan", filters.rombongan === "true");
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDeletedPeserta(): Promise<Peserta[]> {
  const { data, error } = await supabaseAdmin
    .from("peserta")
    .select("*")
    .eq("is_deleted", true)
    .order("deleted_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function softDeletePeserta(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("peserta")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function restorePeserta(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("peserta")
    .update({ is_deleted: false, deleted_at: null })
    .eq("id", id);

  if (error) throw error;
}

// Menandai peserta telah hadir saat registrasi ulang hari-H
export async function markPesertaHadir(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("peserta")
    .update({ is_hadir: true, hadir_at: new Date().toISOString() })
    .eq("id", id)
    .eq("is_deleted", false);

  if (error) throw error;
}

// Membatalkan tanda hadir (mis. salah klik)
export async function unmarkPesertaHadir(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("peserta")
    .update({ is_hadir: false, hadir_at: null })
    .eq("id", id)
    .eq("is_deleted", false);

  if (error) throw error;
}

export async function permanentDeletePeserta(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("peserta").delete().eq("id", id);

  if (error) throw error;
}

export async function permanentDeleteAllPeserta(): Promise<void> {
  const { error } = await supabaseAdmin.from("peserta").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) throw error;
}

export async function getSummary(): Promise<{
  total_headcount: number;
  total_hadir: number;
  total_menginap: number;
  total_motor: number;
  total_mobil: number;
  total_angkotan_umum: number;
  total_ikhwan_dewasa: number;
  total_akhwat_dewasa: number;
  total_anak_laki: number;
  total_anak_perempuan: number;
  total_asatidzah: number;
  total_peserta_non_asatidzah: number;
  total_paket_makan_peserta: number;
  total_paket_makan_asatidzah: number;
}> {
  const { data: peserta, error } = await supabaseAdmin
    .from("peserta")
    .select("*")
    .eq("is_deleted", false);

  if (error) throw error;

  const activePeserta = peserta ?? [];

  let total_headcount = 0;
  let total_hadir = 0;
  let total_menginap = 0;
  let total_motor = 0;
  let total_mobil = 0;
  let total_angkotan_umum = 0;
  let total_ikhwan_dewasa = 0;
  let total_akhwat_dewasa = 0;
  let total_anak_laki = 0;
  let total_anak_perempuan = 0;
  let total_asatidzah = 0;
  let total_peserta_non_asatidzah = 0;
  let total_paket_makan_peserta = 0;
  let total_paket_makan_asatidzah = 0;

  for (const p of activePeserta) {
    const headcount = getPesertaHeadcount(
      p.rombongan_ikhwan_dewasa,
      p.rombongan_ikhwan_anak,
      p.rombongan_akhwat_dewasa,
      p.rombongan_akhwat_anak
    );
    total_headcount += headcount;

    total_ikhwan_dewasa += p.rombongan_ikhwan_dewasa;
    total_akhwat_dewasa += p.rombongan_akhwat_dewasa;
    total_anak_laki += p.rombongan_ikhwan_anak;
    total_anak_perempuan += p.rombongan_akhwat_anak;

    // Asatidzah per peserta = pendaftar (jika centang "saya asatidzah") + rombongan asatidzah.
    // Asatidzah sudah termasuk dalam angka dewasa, sehingga hanya mengurangi porsi paket makan peserta.
    const asatidzahPeserta = (p.is_asatidzah ? 1 : 0) + p.jumlah_asatidzah;
    total_asatidzah += asatidzahPeserta;

    // Jumlah peserta non-asatidzah (headcount dikurangi asatidzah, karena asatidzah
    // bukan bagian dari jatah peserta biasa). Dipakai kartu "Total Peserta" dan modal paket makan.
    total_peserta_non_asatidzah += headcount - asatidzahPeserta;

    // Paket makan dihitung terpisah (asatidzah tidak memakai jatah peserta biasa).
    // Total makan = 5 kali selama acara (malam 21/8 + 3x 22/8 + pagi 23/8).
    total_paket_makan_peserta += (headcount - asatidzahPeserta) * 5;
    total_paket_makan_asatidzah += asatidzahPeserta * 5;

    if (p.is_hadir) {
      total_hadir += headcount;
    }

    if (p.menginap) {
      total_menginap += headcount;
    }

    switch (p.jenis_kendaraan) {
      case "motor":
        total_motor += 1;
        break;
      case "mobil":
        total_mobil += 1;
        break;
      case "angkutan_umum":
        total_angkotan_umum += 1;
        break;
    }
  }

  return {
    total_headcount,
    total_hadir,
    total_menginap,
    total_motor,
    total_mobil,
    total_angkotan_umum,
    total_ikhwan_dewasa,
    total_akhwat_dewasa,
    total_anak_laki,
    total_anak_perempuan,
    total_asatidzah,
    total_peserta_non_asatidzah,
    total_paket_makan_peserta,
    total_paket_makan_asatidzah,
  };
}