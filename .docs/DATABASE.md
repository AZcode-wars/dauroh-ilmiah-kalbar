# Database Implementation (Supabase PostgreSQL)

Dokumen ini mendefinisikan skema database final, RLS (Row Level Security) policies, indexing, dan instruksi seeding untuk Supabase.

## Skema `peserta`

```sql
CREATE TABLE public.peserta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nama text NOT NULL,
  nomor_wa text NOT NULL UNIQUE,
  menginap boolean NOT NULL,
  asal text NOT NULL,

  membawa_rombongan boolean NOT NULL DEFAULT false,
  jumlah_rombongan integer,

  tipe_waktu_berangkat text NOT NULL CHECK (tipe_waktu_berangkat IN ('jam_pasti', 'fleksibel')),
  waktu_berangkat timestamp with time zone,
  deskripsi_berangkat text,

  tipe_waktu_kepulangan text NOT NULL CHECK (tipe_waktu_kepulangan IN ('jam_pasti', 'fleksibel')),
  waktu_kepulangan timestamp with time zone,
  deskripsi_kepulangan text,

  jenis_kendaraan text NOT NULL CHECK (
    jenis_kendaraan IN ('motor', 'mobil', 'angkutan_umum')
  ),

  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX peserta_is_deleted_idx ON public.peserta (is_deleted);
CREATE INDEX peserta_asal_idx ON public.peserta (asal);
CREATE INDEX peserta_menginap_idx ON public.peserta (menginap);
CREATE INDEX peserta_jenis_kendaraan_idx ON public.peserta (jenis_kendaraan);
CREATE INDEX peserta_created_at_idx ON public.peserta (created_at DESC);
```

## Skema `settings`

```sql
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_open_at timestamp with time zone NOT NULL,
  registration_close_at timestamp with time zone NOT NULL,
  contact_person_wa text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
```

## Seeding Initial Data

Table `settings` WAJIB memiliki setidaknya 1 baris data karena aplikasi selalu menggunakan `.single()` atau `maybeSingle()` saat melakukan GET settings.

Jalankan query ini di Supabase SQL Editor setelah tabel terbuat:

```sql
INSERT INTO public.settings (registration_open_at, registration_close_at, contact_person_wa)
VALUES (
  '2026-08-01T00:00:00.000Z', 
  '2026-08-18T17:00:00.000Z', 
  '081234567890'
);
```

## Row Level Security (RLS)

Aplikasi Dauroh Manis Raya ini menggunakan **Service Role Key** di sisi server (Next.js API routes) untuk berinteraksi dengan database.

Untuk keamanan dasar, aktifkan RLS dan blokir akses anonymous:

```sql
ALTER TABLE public.peserta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
```

**Catatan penting:** Karena semua akses database dilakukan melalui backend service role, tidak perlu membuat policy RLS yang detail. Akses anonymous secara otomatis ditolak karena tidak ada policy `anon` yang di-create.

## Headcount Calculation

Headcount dihitung dengan formula berikut (aplikatif di backend atau query):

```sql
CASE 
  WHEN membawa_rombongan THEN 1 + COALESCE(jumlah_rombongan, 0)
  ELSE 1 
END AS headcount
```

Headcount digunakan untuk:

- Menghitung total orang untuk logistik (makan, tempat tidur).
- Menentukan `total_paket_makan = total_headcount * 3`.

## Data Canonicalization (Wajib di Backend)

Sebelum insert/update ke database, backend harus melakukan canonicalization:

| Input | Output |
|-------|--------|
| `membawa_rombongan = false`, `jumlah_rombongan = 3` | `jumlah_rombongan = null` |
| `tipe_waktu_berangkat = 'jam_pasti'`, `deskripsi_berangkat = 'pagi'` | `deskripsi_berangkat = null` |
| `tipe_waktu_berangkat = 'fleksibel'`, `waktu_berangkat = '2026-08-20T10:00:00Z'` | `waktu_berangkat = null` |

Ini memastikan tidak ada data ganda dan konsisten di database.

## Fallback Settings

Jika tabel `settings` kosong, aplikasi menggunakan fallback default:

```ts
{
  id: "fallback-settings",
  registration_open_at: "2026-08-01T00:00:00.000Z",
  registration_close_at: "2026-08-18T17:00:00.000Z",
  contact_person_wa: "081234567890",
  updated_at: "1970-01-01T00:00:00.000Z"
}
```

Fallback ini dicegah aplikasi crash saat `SELECT SINGLE` gagal, tapi admin sebaiknya langsung seed settings yang valid lewat dashboard.

## Migration Notes

Untuk deployment production:

1. Seed `settings` row sebelum deploy.
2. Verifikasi unique constraint `nomor_wa` aktif.
3. Test insert/update dengan canonicalization.
4. Pastikan `is_deleted` column di-update bukan delete row.
