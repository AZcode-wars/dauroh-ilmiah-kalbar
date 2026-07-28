# PRD: Platform Pendaftaran Event Dauroh Manis Raya

## 1. Problem Statement

Pendaftaran Dauroh Manis Raya selama ini dilakukan secara manual melalui WhatsApp. Peserta menghubungi contact person dengan format tertentu, lalu admin merekap data satu per satu secara manual. Setelah itu, admin menghitung kebutuhan makan, memperkirakan kapasitas tempat tidur untuk peserta yang menginap di pondok, mencatat jenis kendaraan peserta, dan mengelola konfirmasi kedatangan ulang lewat kertas.

Alur ini terlalu bergantung pada pekerjaan teknis dan birokrasi manual. Masalah utama tidak terlalu dirasakan peserta, tetapi sangat membebani admin karena proses pendaftaran, rekap, estimasi logistik, dan konfirmasi ulang dilakukan secara terpisah.

Dibutuhkan satu platform digital sebagai sumber data utama untuk pendaftaran, rekap peserta, kebutuhan logistik, informasi kendaraan, asal peserta, dan data administratif lain agar panitia dapat bekerja lebih efisien.

## 2. Solution Overview

Membangun web app pendaftaran event “Dauroh Manis Raya” yang terdiri dari:

1. Frontend publik berupa landing page dan halaman formulir pendaftaran.
2. Backend sederhana berupa dashboard admin untuk melihat, mencari, memfilter, mengekspor, dan mengelola data pendaftar.
3. Database Supabase sebagai tempat penyimpanan data pendaftar dan pengaturan pendaftaran.
4. Export CSV agar data dapat dipindahkan ke spreadsheet atau Excel.
5. Soft-delete dan Trash section agar data peserta yang dibatalkan tidak langsung hilang dari database.
6. Settings dashboard agar admin dapat mengatur waktu buka/tutup pendaftaran dan nomor contact person WhatsApp.

Untuk V1, aplikasi difokuskan untuk satu event “Dauroh Manis Raya” dengan informasi event yang di-hardcode. Fitur reusable multi-event ditunda ke V2.

## 3. Goals

### Primary Goals

1. Menyatukan proses pendaftaran event dalam satu platform digital.
2. Mengurangi pekerjaan manual admin dalam input dan rekap data.
3. Menghasilkan data peserta, kendaraan, asal, penginapan, dan logistik secara otomatis.
4. Menyediakan dashboard admin untuk monitoring dan pengambilan keputusan logistik.
5. Menyediakan export CSV untuk pengolahan lanjutan di spreadsheet atau Excel.

### Secondary Goals

1. Membuat pengalaman pendaftaran mobile-friendly untuk peserta.
2. Membuat dashboard admin yang tetap bisa diakses dari desktop maupun mobile.
3. Menyediakan dasar teknis yang bisa dikembangkan ke V2 jika V1 sudah solid.

## 4. Target Users

### Peserta Dauroh

- Mengakses landing page publik.
- Melihat informasi event, fasilitas, rundown, dan lokasi.
- Mengisi formulir pendaftaran tanpa login.
- Mayoritas menggunakan perangkat mobile.

### Admin/Panitia

- Mengakses dashboard memakai password sederhana.
- Melihat tabel peserta aktif.
- Mencari dan memfilter peserta.
- Melihat ringkasan logistik.
- Mengekspor data ke CSV.
- Menghapus, memulihkan, atau menghapus permanen data peserta dari Trash.
- Mengatur waktu buka/tutup pendaftaran dan contact person WhatsApp.

## 5. Event Context

- Nama event: Dauroh Manis Raya.
- Tanggal event: 21–23 Agustus 2026.
- Perkiraan peserta: sekitar 140 orang berdasarkan event sebelumnya.
- Mayoritas peserta menginap di pondok.
- Sekitar 1 dari 10 peserta memilih tidak menginap di pondok.
- Pendaftaran kemungkinan dibuka dari awal Agustus sampai 3 hari sebelum hari H.
- Waktu buka/tutup pendaftaran dapat diatur admin lewat dashboard.

## 6. User Stories

### Peserta

1. Sebagai peserta, saya ingin melihat informasi lengkap Dauroh Manis Raya dalam satu halaman.
2. Sebagai peserta, saya ingin melihat fasilitas yang disediakan.
3. Sebagai peserta, saya ingin melihat rincian/rundown acara.
4. Sebagai peserta, saya ingin melihat lokasi event, alamat lengkap, link Google Maps, dan koordinat.
5. Sebagai peserta, saya ingin mendaftar lewat form mobile-friendly tanpa login.
6. Sebagai peserta, saya ingin memilih apakah saya menginap di pondok atau tidak.
7. Sebagai peserta, saya ingin menginformasikan apakah saya datang sendiri atau membawa keluarga/rombongan.
8. Sebagai peserta, saya ingin mengisi waktu berangkat dan kepulangan secara fleksibel, baik memakai jam pasti maupun deskripsi bebas.
9. Sebagai peserta, saya ingin mendapat alert sukses dan halaman konfirmasi setelah berhasil daftar.
10. Sebagai peserta, saya ingin bisa menghubungi panitia lewat WhatsApp dari landing page.

### Admin

1. Sebagai admin, saya ingin login dashboard dengan password sederhana.
2. Sebagai admin, saya ingin melihat semua peserta aktif dalam tabel.
3. Sebagai admin, saya ingin mencari peserta berdasarkan nama atau nomor WhatsApp.
4. Sebagai admin, saya ingin memfilter peserta berdasarkan menginap/tidak, asal, kendaraan, dan rombongan/sendiri.
5. Sebagai admin, saya ingin melihat summary total headcount, total yang menginap, kendaraan, dan paket makan.
6. Sebagai admin, saya ingin mengekspor data peserta aktif ke CSV.
7. Sebagai admin, saya ingin melihat detail peserta dalam modal preview.
8. Sebagai admin, saya ingin melakukan soft-delete peserta yang membatalkan pendaftaran.
9. Sebagai admin, saya ingin melihat peserta yang sudah dihapus di Trash section.
10. Sebagai admin, saya ingin restore peserta dari Trash jika salah hapus.
11. Sebagai admin, saya ingin menghapus peserta secara permanen dari Trash jika dibutuhkan.
12. Sebagai admin, saya ingin mengatur waktu buka/tutup pendaftaran dan contact person WhatsApp.

## 7. Functional Requirements

### 7.1 Public Landing Page

Landing page bersifat publik, tidak membutuhkan login, dan mobile-first.

Landing page harus memiliki section:

1. Header/Hero
   - Judul event.
   - Tanggal event.
   - Pemateri.
   - Waktu event.
   - CTA “Daftar Sekarang”.
2. Tentang Dauroh.
3. Fasilitas yang disediakan.
4. Rincian event/rundown acara.
5. Lokasi event.
   - Google Maps embed atau preview map.
   - Alamat lengkap.
   - Link untuk membuka lokasi di Google Maps.
   - Fitur copy koordinat.
6. CTA daftar dan contact person.
   - CTA menuju halaman form.
   - Button WhatsApp panitia.

### 7.2 Registration Form

Form pendaftaran terbuka untuk publik selama periode pendaftaran aktif.

Field yang dikumpulkan:

1. Nama Lengkap.
2. Nomor WhatsApp aktif.
3. Pilihan menginap/tidak menginap.
4. Asal peserta berupa dropdown kabupaten/kota Kalimantan Barat.
5. Datang sendiri atau membawa keluarga/rombongan.
6. Jumlah rombongan/keluarga yang dibawa jika membawa rombongan.
7. Perkiraan waktu berangkat.
   - Toggle: Jam Pasti atau Deskripsi Fleksibel.
   - Jika Jam Pasti, tampilkan datetime picker.
   - Jika Deskripsi Fleksibel, tampilkan textarea.
8. Perkiraan waktu kepulangan.
   - Toggle: Jam Pasti atau Deskripsi Fleksibel.
   - Jika Jam Pasti, tampilkan datetime picker.
   - Jika Deskripsi Fleksibel, tampilkan textarea.
9. Kendaraan yang digunakan.
   - Motor.
   - Mobil.
   - Angkutan Umum.

### 7.3 Registration Closed State

Jika pendaftaran belum dibuka atau sudah ditutup:

1. Form tidak ditampilkan.
2. Halaman menampilkan pesan: `Pendaftaran Tidak Tersedia`.
3. Ada button CTA untuk kembali ke beranda.

### 7.4 Confirmation Page

Setelah submit berhasil:

1. Tampilkan alert sukses.
2. Redirect atau tampilkan confirmation page.
3. Confirmation page menampilkan ringkasan data yang baru diinput.

### 7.5 Validation

Frontend dan backend harus melakukan validasi.

Rules:

1. Field wajib kosong menampilkan toast error: `Harap {field} diisi terlebih dahulu!`
2. Nomor WA valid hanya format `08xxx` atau `628xxx`, tanpa `+`.
3. Nomor WA tidak valid menampilkan toast error: `Nomor Whatsapp Tidak Valid!`
4. Duplicate nomor WA aktif ditolak.
5. Duplicate nomor WA menampilkan toast warning: `Nomor sudah terdaftar. Silahkan gunakan nomor lain`
6. Jika membawa rombongan, jumlah rombongan wajib diisi minimal 1.
7. Jika tidak membawa rombongan, jumlah rombongan disimpan `null` atau 0 sesuai implementasi, tetapi tidak dihitung sebagai tambahan.
8. Untuk waktu berangkat, wajib mengisi salah satu dari datetime atau deskripsi fleksibel.
9. Untuk waktu kepulangan, wajib mengisi salah satu dari datetime atau deskripsi fleksibel.

Regex nomor WhatsApp:

```ts
/^(08|628)[0-9]{8,13}$/
```

### 7.6 Admin Authentication

1. Dashboard admin dilindungi password sederhana.
2. Password V1 boleh hardcoded di kode.
3. Tidak perlu username.
4. Setelah login berhasil, session disimpan di cookie.
5. Session permanent sampai admin logout manual.
6. Route dashboard harus redirect ke login jika cookie session tidak valid.

### 7.7 Admin Dashboard Main

Dashboard utama harus menyediakan:

1. Tabel peserta aktif.
2. Search berdasarkan nama dan nomor WA.
3. Filter berdasarkan:
   - Menginap/tidak menginap.
   - Asal kabupaten/kota.
   - Jenis kendaraan.
   - Membawa rombongan/sendiri.
4. Summary/ringkasan:
   - Total headcount keseluruhan.
   - Total headcount yang menginap.
   - Total kendaraan berdasarkan jenis.
   - Total paket makan.
5. Export CSV.
6. Modal preview detail peserta.
7. Soft-delete peserta dari modal preview.

### 7.8 Headcount and Logistics Calculation

Headcount harus dihitung berdasarkan jumlah orang nyata, bukan jumlah form.

Formula per pendaftar:

```ts
headcount = membawa_rombongan ? 1 + jumlah_rombongan : 1;
```

Total headcount:

```ts
total_headcount = sum(headcount semua peserta aktif);
```

Total menginap:

```ts
total_menginap = sum(headcount peserta aktif dengan menginap = true);
```

Total paket makan:

```ts
total_paket_makan = total_headcount * 3;
```

Catatan:

- 1 peserta/orang = 1 paket makan.
- 1 paket makan = 3 kali makan sehari.
- Peserta yang soft-deleted tidak dihitung dalam summary.

### 7.9 CSV Export

Export CSV harus:

1. Mengekspor peserta aktif saja.
2. Mengecualikan peserta soft-deleted.
3. Memuat seluruh field input peserta.
4. Bisa dibuka di spreadsheet atau Excel.
5. Menggunakan PapaParse.

Field CSV minimal:

- nama
- nomor_wa
- menginap
- asal
- membawa_rombongan
- jumlah_rombongan
- waktu_berangkat
- deskripsi_berangkat
- waktu_kepulangan
- deskripsi_kepulangan
- jenis_kendaraan
- created_at

Rekomendasi tambahan:

- `headcount`
- `paket_makan`

### 7.10 Preview and Delete

Admin tidak mengedit data peserta di V1.

Fitur yang dimaksud sebagai “edit” adalah:

1. Admin klik peserta di tabel.
2. Sistem membuka modal preview detail peserta.
3. Admin dapat soft-delete peserta jika peserta membatalkan pendaftaran.
4. Soft-delete harus meminta konfirmasi.

### 7.11 Soft Delete and Trash

Soft-delete behavior:

1. Data tidak benar-benar dihapus dari database.
2. Data ditandai dengan `is_deleted = true`.
3. `deleted_at` diisi timestamp saat delete.
4. Peserta soft-deleted tidak tampil di tabel utama.
5. Peserta soft-deleted tidak dihitung dalam summary.
6. Peserta soft-deleted tidak masuk export CSV.

Trash section:

1. Menampilkan peserta yang `is_deleted = true`.
2. Menampilkan field tabel seperti peserta aktif.
3. Menampilkan timestamp `deleted_at`.
4. Menyediakan action Restore.
5. Menyediakan action Permanently Delete.
6. Permanently Delete harus memakai confirmation dialog.

### 7.12 Settings Page

Settings page berada di dashboard admin.

Field yang bisa diedit:

1. Waktu buka pendaftaran.
2. Waktu tutup pendaftaran.
3. Nomor contact person WhatsApp.

Rules:

1. Waktu tutup harus setelah waktu buka.
2. Contact person WA mengikuti format nomor WA valid.
3. Perubahan settings langsung mempengaruhi halaman form.
4. Contact person WA dipakai untuk CTA WhatsApp di landing page.

## 8. Non-Functional Requirements

| Aspect | Requirement |
| --- | --- |
| Performance | Page load target < 2 detik untuk landing/form pada koneksi normal. |
| Submit | Form submit target < 1 detik jika koneksi stabil. |
| Scale | Mendukung minimal 140 peserta, aman untuk beberapa ratus peserta. |
| Security | Dashboard password protected dan cookie-based session. |
| Data Safety | Soft-delete sebagai default delete peserta. |
| Responsiveness | Landing page dan form mobile-first; dashboard desktop-focused tapi responsif mobile. |
| Browser Support | Chrome, Firefox, Safari, Edge versi modern. |
| Timezone | Semua waktu ditampilkan dalam WIB / UTC+7. |
| Data Storage | Datetime disimpan sebagai timestamp di Supabase. |
| Deployment | Vercel. |
| Maintainability | Kode TypeScript, komponen kecil, struktur standar Next.js. |

## 9. Tech Stack

1. Framework: Next.js dengan App Router.
2. Language: TypeScript.
3. Styling: Tailwind CSS.
4. Component library: shadcn/ui.
5. Form: React Hook Form.
6. Validation: Zod.
7. Database: Supabase.
8. Database client: Supabase JS Client.
9. CSV export: PapaParse.
10. Deployment: Vercel.
11. Version control: GitHub repository baru, owner adalah pemilik project.

## 10. Database Schema

### 10.1 Table: `peserta`

```sql
create table peserta (
  id uuid primary key default gen_random_uuid(),

  nama text not null,
  nomor_wa text not null unique,
  menginap boolean not null,
  asal text not null,

  membawa_rombongan boolean not null default false,
  jumlah_rombongan integer,

  waktu_berangkat timestamp with time zone,
  deskripsi_berangkat text,

  waktu_kepulangan timestamp with time zone,
  deskripsi_kepulangan text,

  jenis_kendaraan text not null check (
    jenis_kendaraan in ('motor', 'mobil', 'angkutan_umum')
  ),

  is_deleted boolean not null default false,
  deleted_at timestamp with time zone,

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
```

### 10.2 Table: `settings`

```sql
create table settings (
  id uuid primary key default gen_random_uuid(),
  registration_open_at timestamp with time zone not null,
  registration_close_at timestamp with time zone not null,
  contact_person_wa text not null,
  updated_at timestamp with time zone not null default now()
);
```

### 10.3 Indexes

```sql
create index peserta_is_deleted_idx on peserta (is_deleted);
create index peserta_asal_idx on peserta (asal);
create index peserta_menginap_idx on peserta (menginap);
create index peserta_jenis_kendaraan_idx on peserta (jenis_kendaraan);
create index peserta_created_at_idx on peserta (created_at desc);
```

## 11. Constants

### 11.1 Kabupaten/Kota Kalimantan Barat

```ts
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
```

### 11.2 Jenis Kendaraan

```ts
export const JENIS_KENDARAAN = [
  { value: "motor", label: "Motor" },
  { value: "mobil", label: "Mobil" },
  { value: "angkutan_umum", label: "Angkutan Umum" },
] as const;
```

## 12. API Design

### 12.1 Public APIs

#### `GET /api/settings`

Mengambil waktu buka/tutup pendaftaran dan contact person WA.

Response:

```ts
type SettingsResponse = {
  registration_open_at: string;
  registration_close_at: string;
  contact_person_wa: string;
};
```

#### `POST /api/peserta/register`

Mendaftarkan peserta baru.

Request:

```ts
type RegisterPesertaRequest = {
  nama: string;
  nomor_wa: string;
  menginap: boolean;
  asal: string;
  membawa_rombongan: boolean;
  jumlah_rombongan: number | null;
  waktu_berangkat: string | null;
  deskripsi_berangkat: string | null;
  waktu_kepulangan: string | null;
  deskripsi_kepulangan: string | null;
  jenis_kendaraan: "motor" | "mobil" | "angkutan_umum";
};
```

Success response:

```ts
type RegisterPesertaSuccess = {
  success: true;
  message: "Pendaftaran berhasil";
  data: Peserta;
};
```

Error response:

```ts
type RegisterPesertaError = {
  success: false;
  message: string;
};
```

Backend flow:

1. Validate request body dengan Zod.
2. Check registration window dari `settings`.
3. Check duplicate nomor WA aktif.
4. Insert data ke Supabase.
5. Return response success/error.

### 12.2 Auth APIs

#### `POST /api/auth/login`

Request:

```ts
type LoginRequest = {
  password: string;
};
```

Behavior:

1. Jika password benar, set cookie `admin_session=authenticated`.
2. Jika password salah, return error.

#### `POST /api/auth/logout`

Behavior:

1. Clear cookie `admin_session`.
2. Redirect atau return success.

### 12.3 Admin APIs

#### `GET /api/admin/peserta`

Query:

```ts
type PesertaQuery = {
  search?: string;
  asal?: string;
  menginap?: "true" | "false";
  kendaraan?: "motor" | "mobil" | "angkutan_umum";
  rombongan?: "true" | "false";
};
```

Behavior:

- Return peserta aktif saja.
- Support search nama/WA.
- Support filter kombinasi.

#### `GET /api/admin/peserta/[id]`

Return detail satu peserta.

#### `DELETE /api/admin/peserta/[id]`

Soft-delete peserta:

```ts
{
  is_deleted: true,
  deleted_at: new Date().toISOString()
}
```

#### `GET /api/admin/peserta/trash`

Return peserta dengan `is_deleted = true`.

#### `PATCH /api/admin/peserta/[id]/restore`

Restore peserta:

```ts
{
  is_deleted: false,
  deleted_at: null
}
```

#### `DELETE /api/admin/peserta/[id]/permanent`

Hapus permanen peserta dari database.

#### `GET /api/admin/peserta/summary`

Return:

```ts
type SummaryResponse = {
  total_headcount: number;
  total_menginap: number;
  total_motor: number;
  total_mobil: number;
  total_angkutan_umum: number;
  total_paket_makan: number;
};
```

#### `GET /api/admin/peserta/export/csv`

Export peserta aktif ke CSV.

#### `GET /api/admin/settings`

Return settings untuk dashboard.

#### `PATCH /api/admin/settings`

Update settings.

Request:

```ts
type UpdateSettingsRequest = {
  registration_open_at: string;
  registration_close_at: string;
  contact_person_wa: string;
};
```

## 13. Component Architecture

```txt
app/
  page.tsx
  register/page.tsx
  register/success/page.tsx

  admin/login/page.tsx
  admin/dashboard/page.tsx
  admin/dashboard/trash/page.tsx
  admin/dashboard/settings/page.tsx
  admin/layout.tsx

  api/auth/login/route.ts
  api/auth/logout/route.ts
  api/settings/route.ts
  api/peserta/register/route.ts
  api/admin/peserta/route.ts
  api/admin/peserta/[id]/route.ts
  api/admin/peserta/[id]/restore/route.ts
  api/admin/peserta/[id]/permanent/route.ts
  api/admin/peserta/trash/route.ts
  api/admin/peserta/summary/route.ts
  api/admin/peserta/export/csv/route.ts
  api/admin/settings/route.ts

components/
  landing/HeroSection.tsx
  landing/AboutSection.tsx
  landing/FasilitasSection.tsx
  landing/RundownSection.tsx
  landing/LokasiSection.tsx
  landing/CTASection.tsx

  register/RegistrationForm.tsx
  register/TimeToggleField.tsx
  register/ClosedRegistration.tsx
  register/ConfirmationSummary.tsx

  admin/AdminShell.tsx
  admin/AdminSidebar.tsx
  admin/LoginForm.tsx
  admin/PesertaTable.tsx
  admin/PesertaDetailModal.tsx
  admin/FilterBar.tsx
  admin/SummaryCards.tsx
  admin/ExportCsvButton.tsx
  admin/TrashTable.tsx
  admin/SettingsForm.tsx

lib/
  supabase/client.ts
  supabase/server.ts
  auth.ts
  constants.ts
  validations.ts
  csv.ts
  dates.ts
  peserta.ts
  settings.ts
  whatsapp.ts

types/
  peserta.ts
  settings.ts
```

## 14. Data Flow

### 14.1 Registration Flow

```txt
Peserta
  ↓
Landing Page
  ↓ klik CTA
Register Page
  ↓ fetch settings
Jika pendaftaran tutup → tampil "Pendaftaran Tidak Tersedia"
Jika pendaftaran buka → tampil form
  ↓ submit
Frontend validation
  ↓
POST /api/peserta/register
  ↓
Backend validation + duplicate check + insert Supabase
  ↓
Confirmation Page + alert sukses
```

### 14.2 Admin Flow

```txt
Admin
  ↓
Login Page
  ↓ password benar
Cookie session diset
  ↓
Dashboard
  ↓
Tabel + search + filter + summary
  ↓
Preview modal / soft-delete / export CSV / settings / trash
```

## 15. Implementation Plan

### Task 1: Project Setup

Deliverable:

- Next.js app berjalan lokal.
- TypeScript aktif.
- Tailwind aktif.
- shadcn/ui aktif.
- Dependencies terpasang.

Dependencies:

- `@supabase/supabase-js`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `papaparse`
- toast library sesuai shadcn setup

Verification:

```bash
npm run dev
npm run lint
npm run typecheck
```

### Task 2: Supabase Setup

Deliverable:

- Table `peserta` dibuat.
- Table `settings` dibuat.
- Indexes dibuat.
- 1 row settings awal dibuat.

Verification:

- Query `peserta` sukses di Supabase.
- Query `settings` sukses di Supabase.

### Task 3: Types, Constants, Validation

Files:

- `types/peserta.ts`
- `types/settings.ts`
- `lib/constants.ts`
- `lib/validations.ts`
- `lib/dates.ts`

Deliverable:

- Domain types tersedia.
- Kabupaten Kalbar tersedia.
- Jenis kendaraan tersedia.
- Zod schema registration tersedia.
- Helper WIB formatting tersedia.

Verification:

```bash
npm run lint
npm run typecheck
```

### Task 4: Supabase Helpers

Files:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/peserta.ts`
- `lib/settings.ts`

Deliverable:

- Helper query Supabase reusable tersedia.

Required functions:

```ts
getSettings(): Promise<Settings>
createPeserta(input: RegisterPesertaInput): Promise<Peserta>
getActivePeserta(filters: PesertaFilters): Promise<Peserta[]>
getDeletedPeserta(): Promise<Peserta[]>
softDeletePeserta(id: string): Promise<void>
restorePeserta(id: string): Promise<void>
permanentDeletePeserta(id: string): Promise<void>
getSummary(): Promise<Summary>
updateSettings(input: UpdateSettingsInput): Promise<Settings>
```

Verification:

```bash
npm run lint
npm run typecheck
```

### Task 5: Public APIs

Files:

- `app/api/settings/route.ts`
- `app/api/peserta/register/route.ts`

Deliverable:

- Public settings API berjalan.
- Registration API berjalan.

Verification:

- Valid registration sukses.
- Empty field ditolak.
- Invalid WA ditolak.
- Duplicate WA ditolak.
- Closed registration ditolak.

### Task 6: Admin Auth

Files:

- `lib/auth.ts`
- `middleware.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/admin/login/page.tsx`
- `components/admin/LoginForm.tsx`
- `app/admin/layout.tsx`

Deliverable:

- Login admin berjalan.
- Cookie session berjalan.
- Admin route terlindungi.
- Logout berjalan.

Verification:

- `/admin/dashboard` tanpa cookie redirect ke `/admin/login`.
- Password benar membuka dashboard.
- Logout menghapus akses.

### Task 7: Landing Page

Files:

- `app/page.tsx`
- `components/landing/HeroSection.tsx`
- `components/landing/AboutSection.tsx`
- `components/landing/FasilitasSection.tsx`
- `components/landing/RundownSection.tsx`
- `components/landing/LokasiSection.tsx`
- `components/landing/CTASection.tsx`
- `lib/whatsapp.ts`

Deliverable:

- Landing page publik selesai.
- CTA daftar bekerja.
- CTA WhatsApp bekerja.
- Lokasi dan copy koordinat bekerja.

Verification:

- Mobile viewport rapi.
- Desktop viewport rapi.
- CTA `/register` bekerja.
- WhatsApp URL benar.

### Task 8: Registration UI

Files:

- `app/register/page.tsx`
- `app/register/success/page.tsx`
- `components/register/RegistrationForm.tsx`
- `components/register/TimeToggleField.tsx`
- `components/register/ClosedRegistration.tsx`
- `components/register/ConfirmationSummary.tsx`

Deliverable:

- Peserta bisa daftar.
- Closed registration state bekerja.
- Confirmation page bekerja.

Verification:

- Toast field kosong muncul.
- Toast WA invalid muncul.
- Toast duplicate WA muncul.
- Submit sukses masuk Supabase.
- Summary konfirmasi sesuai input.

### Task 9: Admin Dashboard Main

Files:

- `app/admin/dashboard/page.tsx`
- `app/api/admin/peserta/route.ts`
- `app/api/admin/peserta/[id]/route.ts`
- `app/api/admin/peserta/summary/route.ts`
- `components/admin/AdminShell.tsx`
- `components/admin/AdminSidebar.tsx`
- `components/admin/PesertaTable.tsx`
- `components/admin/PesertaDetailModal.tsx`
- `components/admin/FilterBar.tsx`
- `components/admin/SummaryCards.tsx`

Deliverable:

- Tabel peserta aktif berjalan.
- Search/filter berjalan.
- Summary headcount berjalan.
- Preview modal berjalan.
- Soft-delete berjalan.

Verification:

- Deleted peserta hilang dari tabel utama.
- Deleted peserta tidak dihitung summary.
- Filter menghasilkan data benar.
- Search nama/WA benar.

### Task 10: CSV Export

Files:

- `app/api/admin/peserta/export/csv/route.ts`
- `components/admin/ExportCsvButton.tsx`
- `lib/csv.ts`

Deliverable:

- Admin bisa download CSV peserta aktif.

Verification:

- CSV bisa dibuka di spreadsheet.
- Deleted peserta tidak masuk CSV.
- Field input lengkap.
- Headcount dan paket makan tersedia bila ditambahkan.

### Task 11: Trash Section

Files:

- `app/admin/dashboard/trash/page.tsx`
- `app/api/admin/peserta/trash/route.ts`
- `app/api/admin/peserta/[id]/restore/route.ts`
- `app/api/admin/peserta/[id]/permanent/route.ts`
- `components/admin/TrashTable.tsx`

Deliverable:

- Trash section berjalan.
- Restore berjalan.
- Permanent delete berjalan.

Verification:

- Soft-deleted peserta muncul di Trash.
- Restore mengembalikan peserta ke dashboard utama.
- Permanent delete menghapus row dari Supabase.

### Task 12: Settings Page

Files:

- `app/admin/dashboard/settings/page.tsx`
- `app/api/admin/settings/route.ts`
- `components/admin/SettingsForm.tsx`

Deliverable:

- Admin bisa edit waktu buka/tutup dan contact WA.

Verification:

- Close time masa lalu membuat form hidden.
- Close time masa depan membuat form visible.
- Contact WA berubah di CTA landing page.

### Task 13: Responsive Polish

Deliverable:

- Landing page mobile-first.
- Form mobile-first.
- Dashboard nyaman di desktop.
- Dashboard tetap bisa dipakai di mobile.

Verification:

- Test viewport mobile.
- Test viewport tablet.
- Test viewport desktop.
- Modal dan tabel tetap usable.

### Task 14: Final QA and Deployment

Deliverable:

- App siap deploy ke Vercel.

Verification commands:

```bash
npm run lint
npm run typecheck
npm run build
```

Manual production checklist:

1. Landing page loads.
2. Contact WA works.
3. Registration open/closed works.
4. Submit participant works.
5. Duplicate WA rejected.
6. Admin login works.
7. Dashboard summary correct.
8. CSV export works.
9. Soft delete works.
10. Trash restore works.
11. Permanent delete works.
12. Settings update works.

## 16. V1 Scope

Included:

- Landing page.
- Registration form.
- Confirmation page.
- Admin password login.
- Dashboard table.
- Search/filter.
- Summary berbasis headcount.
- CSV export.
- Preview modal.
- Soft delete.
- Trash section.
- Restore.
- Permanent delete.
- Settings page.
- Supabase persistence.
- Vercel deployment.

## 17. V2 Backlog

Deferred:

- Multi-admin account.
- Role-based access.
- Change password UI.
- Email automation.
- WhatsApp automation.
- QR code check-in.
- Multi-event management.
- Analytics dashboard.
- Participant self-edit.
- Rate limiting.
- Reusable event CMS.

## 18. Risks and Notes

### Hardcoded Password

Acceptable untuk V1, tetapi tidak aman untuk jangka panjang. V2 sebaiknya memindahkan password ke environment variable atau auth provider.

### No Rate Limiting

V1 tidak memakai rate limiting. Duplicate WA cukup untuk mencegah pendaftaran ganda umum. Tambahkan rate limiting di V2 jika ada abuse.

### Google Maps

Untuk V1, gunakan embed/link Google Maps jika memungkinkan agar tidak perlu API key dan billing. Jika memakai Maps JavaScript API, akan dibutuhkan API key dan konfigurasi billing.

### CSV and WhatsApp Number

Spreadsheet dapat mengubah nomor WA menjadi angka. Saat export, nomor WA perlu diperlakukan sebagai text-safe value jika diperlukan.

### Headcount

Summary logistik memakai total headcount:

```ts
headcount = membawa_rombongan ? 1 + jumlah_rombongan : 1;
total_paket_makan = total_headcount * 3;
```

Peserta soft-deleted tidak dihitung.
