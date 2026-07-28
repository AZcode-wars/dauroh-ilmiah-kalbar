# Panduan Operasional AI Agent (Dauroh Manis Raya)

Dokumen ini berisi instruksi dan batasan ketat bagi AI Agent selama proses _build_ maupun _maintenance_ project ini. Aturan di sini wajib ditaati tanpa kecuali.

## 1. Aturan Penulisan Kode

- **Bahasa Indonesia Utama:** Seluruh copy UI, toast message, error message, logging, dan **komentar di dalam kode** wajib menggunakan bahasa Indonesia.
- **Komentar Penjelasan Wajib:** Setiap blok logika baru, fungsi penting, atau baris kode kompleks harus diberi komentar pendek yang menjelaskan _mengapa_ atau _apa_ yang dilakukan baris tersebut, sesuai instruksi eksplisit dari user.
  - _Contoh benar:_ `// Menghitung headcount: peserta utama + jumlah rombongan (jika ada)`
- **Tanpa Type Casting Buta:** Dilarang keras menggunakan `as SomeType` atau `as any` di TypeScript tanpa verifikasi (misalnya menggunakan Zod atau pengecekan runtime).

## 2. Aturan Git & Bash

- **Jangan Melakukan Commit Sembarangan:** Jangan pernah menjalankan perintah `git commit`, `git push`, atau merubah riwayat Git _kecuali jika diinstruksikan secara eksplisit oleh user_ di prompt saat itu.
- **Validasi Build Wajib:** Setelah setiap penyelesaian sebuah task besar atau refactor, agent WAJIB menjalankan:
  - `npm run lint`
  - `npm run typecheck`
    (Pastikan konfigurasi di `package.json` sudah memiliki script `typecheck`: `tsc --noEmit`).
    Jika ada error, perbaiki terlebih dahulu sebelum melapor bahwa task selesai.

## 3. Lingkungan dan Konvensi Project

- **Tech Stack:** Next.js (App Router), Tailwind CSS, shadcn/ui, Supabase JS Client, React Hook Form, Zod.
- **Database:** Membaca/menulis ke Supabase dilakukan via `Supabase JS Client`, BUKAN Prisma atau ORM lain.
- **Timezone:** Datetime disimpan di database sebagai ISO 8601 UTC. Saat ditampilkan ke pengguna (baik di landing page maupun dashboard admin), wajib dikonversi dan diformat menjadi Waktu Indonesia Barat (WIB / UTC+7).

## 4. Eksekusi Task (Plan Mode vs Build Mode)

- Jika berada di **Plan Mode**, agent tidak diizinkan membuat perubahan kode, menjalankan skrip, atau modifikasi file. Hanya brainstorming dan dokumentasi.
- Jika berada di **Build Mode** (tanda: `<system-reminder>` operational mode changed to build), agent boleh mengubah file dan menjalankan bash script sesuai IMPLEMENTATION_PLAN.md.
- Saat eksekusi di **Build Mode**, hanya jalankan task yang diinstruksikan. Jangan auto-build ke task berikutnya tanpa instruksi eksplisit dari user.
- Setiap menyelesaikan satu task, selalu berikan _Walktrough_ yang berisi hasil output akhir, log langkah (execution log), Evaluasi dan metrik keberhasilan.

**Taati aturan ini untuk menjaga integritas codebase dan konsistensi pengembangan.**
