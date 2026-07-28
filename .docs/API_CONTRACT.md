# API Contract: Dauroh Manis Raya

Semua waktu (time) dikirim dan diterima dalam format ISO 8601 UTC. Tampilan UI mengonversi waktu ke WIB (UTC+7).

## 1. Public Endpoints

### 1.1 Ambil Pengaturan Pendaftaran

Digunakan frontend untuk mengecek apakah form pendaftaran harus dimunculkan atau disembunyikan.

**GET** `/api/settings`

**Response (200 OK)**

```json
{
  "registration_open_at": "2026-08-01T00:00:00.000Z",
  "registration_close_at": "2026-08-18T17:00:00.000Z",
  "contact_person_wa": "081234567890"
}
```

**Response (404 Not Found)**

```json
{
  "error": "Settings not found"
}
```

---

### 1.2 Submit Pendaftaran

Digunakan form pendaftaran untuk submit data peserta.

**POST** `/api/peserta/register`

**Request Body**

```json
{
  "nama": "Ahmad Fauzi",
  "nomor_wa": "081234567890",
  "menginap": true,
  "asal": "Kubu Raya",
  "membawa_rombongan": true,
  "jumlah_rombongan": 3,
  "tipe_waktu_berangkat": "jam_pasti",
  "waktu_berangkat": "2026-08-20T23:00:00.000Z",
  "deskripsi_berangkat": null,
  "tipe_waktu_kepulangan": "fleksibel",
  "waktu_kepulangan": null,
  "deskripsi_kepulangan": "Setelah dzuhur insyaallah",
  "jenis_kendaraan": "mobil"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Pendaftaran berhasil",
  "data": {
    "id": "uuid-here",
    "nama": "Ahmad Fauzi",
    "...": "semua field input ditambah created_at, updated_at, is_deleted, deleted_at"
  }
}
```

**Response (400 Bad Request - Validation Error)**

```json
{
  "success": false,
  "message": "Data tidak valid",
  "errors": [
    { "path": ["nomor_wa"], "message": "Nomor Whatsapp Tidak Valid!" },
    { "path": ["deskripsi_berangkat"], "message": "Harap Deskripsi Waktu Berangkat diisi terlebih dahulu!" }
  ]
}
```

**Response (400 Bad Request - Closed Window)**

```json
{
  "success": false,
  "message": "Pendaftaran Tidak Tersedia"
}
```

**Response (409 Conflict - Duplicate)**

```json
{
  "success": false,
  "message": "Nomor sudah terdaftar. Silahkan gunakan nomor lain"
}
```

**Response (500 Internal Server Error)**

```json
{
  "success": false,
  "message": "Terjadi kesalahan sistem"
}
```

---

## 2. Authentication Endpoints

### 2.1 Login Admin

**POST** `/api/auth/login`

**Request Body**

```json
{
  "password": "mypassword"
}
```

**Response (200 OK)** (Set cookie `admin_session`)

```json
{
  "success": true,
  "message": "Login berhasil"
}
```

**Response (401 Unauthorized)**

```json
{
  "success": false,
  "message": "Password salah"
}
```

### 2.2 Logout Admin

**POST** `/api/auth/logout`

**Response (200 OK)** (Clear cookie `admin_session`)

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 3. Admin Protected Endpoints

Semua endpoint di bawah ini dilindungi oleh middleware atau auth helper. Cookie `admin_session` harus berisi token yang tervalidasi dengan HMAC/secret.

### 3.1 Ambil Daftar Peserta Aktif

**GET** `/api/admin/peserta?search=ahmad&asal=Kubu Raya&menginap=true&kendaraan=mobil&rombongan=true`

**Query Parameters**

- `search`: nama atau nomor WA.
- `asal`: nama kabupaten/kota.
- `menginap`: `"true"` atau `"false"`.
- `kendaraan`: `"motor"`, `"mobil"`, atau `"angkutan_umum"`.
- `rombongan`: `"true"` atau `"false"`.

**Response (200 OK)**

```json
{
  "data": [
    {
      "id": "uuid-here",
      "nama": "Ahmad Fauzi",
      "nomor_wa": "081234567890",
      "menginap": true,
      "asal": "Kubu Raya",
      "membawa_rombongan": true,
      "jumlah_rombongan": 3,
      "tipe_waktu_berangkat": "jam_pasti",
      "waktu_berangkat": "2026-08-20T23:00:00.000Z",
      "deskripsi_berangkat": null,
      "tipe_waktu_kepulangan": "fleksibel",
      "waktu_kepulangan": null,
      "deskripsi_kepulangan": "Setelah dzuhur insyaallah",
      "jenis_kendaraan": "mobil",
      "created_at": "2026-08-05T10:00:00.000Z"
    }
  ]
}
```

**Response (401 Unauthorized)**

```json
{
  "success": false,
  "message": "Sesi habis atau tidak sah"
}
```

### 3.2 Ambil Ringkasan Dashboard

Hitung agregat dari peserta aktif saja.

**GET** `/api/admin/peserta/summary`

**Response (200 OK)**

```json
{
  "total_headcount": 142,
  "total_menginap": 128,
  "total_motor": 54,
  "total_mobil": 31,
  "total_angkutan_umum": 18,
  "total_paket_makan": 426
}
```

Perhitungan:

```ts
headcount = membawa_rombongan ? 1 + jumlah_rombongan : 1;
total_headcount = sum(headcount semua peserta aktif);
total_paket_makan = total_headcount * 3;
```

### 3.3 Hapus Peserta (Soft Delete)

**DELETE** `/api/admin/peserta/[id]`

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Peserta berhasil dihapus"
}
```

**Response (404 Not Found)**

```json
{
  "success": false,
  "message": "Peserta tidak ditemukan"
}
```

### 3.4 Ambil Daftar Trash

**GET** `/api/admin/peserta/trash`

**Response (200 OK)**

```json
{
  "data": [
    {
      "id": "uuid-here",
      "nama": "Muhammad Rizki",
      "deleted_at": "2026-08-05T10:00:00.000Z"
    }
  ]
}
```

### 3.5 Pulihkan Peserta dari Trash

**PATCH** `/api/admin/peserta/[id]/restore`

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Peserta berhasil dipulihkan"
}
```

**Response (404 Not Found)**

```json
{
  "success": false,
  "message": "Peserta tidak ditemukan"
}
```

### 3.6 Hapus Peserta Secara Permanen

**DELETE** `/api/admin/peserta/[id]/permanent`

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Peserta berhasil dihapus permanen"
}
```

**Response (404 Not Found)**

```json
{
  "success": false,
  "message": "Peserta tidak ditemukan"
}
```

### 3.7 Update Pengaturan Pendaftaran

**PATCH** `/api/admin/settings`

**Request Body**

```json
{
  "registration_open_at": "2026-08-01T00:00:00.000Z",
  "registration_close_at": "2026-08-18T17:00:00.000Z",
  "contact_person_wa": "089876543210"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Pengaturan berhasil disimpan",
  "data": {
    "id": "uuid-here",
    "registration_open_at": "...",
    "registration_close_at": "...",
    "contact_person_wa": "..."
  }
}
```

**Response (400 Bad Request)**

```json
{
  "success": false,
  "message": "Waktu tutup harus setelah waktu buka pendaftaran"
}
```

**Response (404 Not Found)**

```json
{
  "success": false,
  "message": "Pengaturan tidak ditemukan"
}
```

### 3.8 Ekspor CSV

**GET** `/api/admin/peserta/export/csv`

**Response (200 OK)**

Headers:

- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="data-peserta.csv"`

Body CSV format (dengan header):

```csv
nama,nomor_wa,menginap,asal,membawa_rombongan,jumlah_rombongan,waktu_berangkat,deskripsi_berangkat,waktu_kepulangan,deskripsi_kepulangan,jenis_kendaraan,headcount,paket_makan,created_at
Ahmad Fauzi,"081234567890",true,Kubu Raya,true,3,2026-08-20T23:00:00.000Z,,2026-08-23T15:00:00.000Z,"Setelah dzuhur insyaallah",mobil,4,12,2026-08-05T10:00:00.000Z
```

Catatan:

- `nomor_wa` dibungkus dengan tanda kutip untuk Excel: `"081234567890"`.
- Kolom `headcount` dan `paket_makan` dihitung secara dinamis.
- Hanya peserta aktif (non-deleted) yang diekspor.

---

## 4. Data Flow Notes

1. **Duplicate WhatsApp**: Backend tidak hanya mengandalkan `checkDuplicateWa()` untuk UX. Database PostgreSQL memiliki constraint `UNIQUE (nomor_wa)`. Ketika insert gagal karena unique constraint, error code `23505` akan di-catch dan dikembalikan response 409.

2. **Canonicalization**: Backend harus mengubah `jumlah_rombongan` menjadi `null` jika `membawa_rombongan` adalah `false` sebelum insert ke database.

3. **Time Toggle**: frontend mengirim `tipe_waktu_berangkat` dan `tipe_waktu_kepulangan` untuk menunjukkan apakah peserta memilih "jam_pasti" atau "fleksibel". Backend menggunakan tipe ini untuk menentukan field mana (datetime vs text) yang diisi.
