import { supabaseAdmin } from "@/lib/supabase/server";
import type { Peserta } from "@/types/peserta";
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

export async function createPeserta(input: RegisterPesertaInput): Promise<Peserta> {
  const { data, error } = await supabaseAdmin
    .from("peserta")
    .insert(input)
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
  total_menginap: number;
  total_motor: number;
  total_mobil: number;
  total_angkotan_umum: number;
  total_paket_makan: number;
}> {
  const { data: peserta, error } = await supabaseAdmin
    .from("peserta")
    .select("*")
    .eq("is_deleted", false);

  if (error) throw error;

  const activePeserta = peserta ?? [];

  let total_headcount = 0;
  let total_menginap = 0;
  let total_motor = 0;
  let total_mobil = 0;
  let total_angkotan_umum = 0;

  for (const p of activePeserta) {
    const headcount = getPesertaHeadcount(p.membawa_rombongan, p.jumlah_rombongan);
    total_headcount += headcount;

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

  const total_paket_makan = total_headcount * 3;

  return {
    total_headcount,
    total_menginap,
    total_motor,
    total_mobil,
    total_angkotan_umum,
    total_paket_makan,
  };
}