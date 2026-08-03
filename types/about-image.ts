// Kontrak bersama galeri About (Task 1) — dipakai seluruh task lanjutan.
// AboutImageRecord: bentuk baris tabel `about_images` hasil query Supabase.
export type AboutImageRecord = {
  id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
};

// AboutImage: baris yang siap dirender, ditambah URL publik ke storage.
export type AboutImage = AboutImageRecord & { url: string };
