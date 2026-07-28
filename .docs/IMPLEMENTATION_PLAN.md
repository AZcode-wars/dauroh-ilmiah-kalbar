# Dauroh Manis Raya Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Dauroh Manis Raya event registration platform including public landing page, registration form, and admin dashboard.

**Architecture:** Next.js App Router handles public UI, admin UI, and API routes in one codebase. Supabase PostgreSQL stores `peserta` and `settings`; all database access goes through server-side API routes using Supabase JS Client. Admin routes use password login with signed cookie session, while participant registration uses React Hook Form + Zod validation and server-side canonicalization.

**Tech Stack:** Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase JS Client, React Hook Form, Zod, PapaParse, date-fns-tz, Sonner.

## Global Constraints

- UI text, toast, error message, and code comments use Bahasa Indonesia.
- Every new block of logic must include concise Indonesian comments explaining intent.
- Public landing and registration pages are mobile-first.
- Admin dashboard is desktop-focused but responsive on mobile.
- Use Next.js App Router, not Pages Router.
- Use Supabase JS Client, not Prisma.
- Use React Hook Form + Zod for form validation.
- Use PapaParse for CSV generation.
- Display all times in WIB (`Asia/Jakarta`); store timestamps as UTC ISO strings.
- Admin password is configured with `ADMIN_PASSWORD` env var for V1.
- Admin session cookie must be signed with `ADMIN_SESSION_SECRET`.
- Cookie `secure` flag must use `process.env.NODE_ENV === "production"` so localhost works.
- Duplicate WhatsApp prevention must rely on DB unique constraint plus Postgres `23505` handling; pre-check is optional UX only.
- Backend must normalize `jumlah_rombongan` to `null` when `membawa_rombongan` is `false`.
- Headcount formula: `membawa_rombongan ? 1 + jumlah_rombongan : 1`.
- CSV must preserve WhatsApp numbers as spreadsheet-safe text.
- Always run `npm run lint`, `npm run typecheck`, and `npm run build` before declaring implementation complete.
- Do not commit unless user explicitly asks.

---

## Source Documents

Implementation must follow these docs:

- `.docs/PRD.md`
- `.docs/API_CONTRACT.md`
- `.docs/DATABASE.md`
- `.docs/DESIGN_WEB_PUBLIC.md`
- `.docs/DESIGN_DASHBOARD.md`
- `.docs/AGENT_INSTRUCTIONS.md`

---

## File Structure

Create or modify these files during implementation:

```txt
app/
  globals.css
  layout.tsx
  page.tsx
  register/page.tsx
  register/success/page.tsx
  admin/layout.tsx
  admin/login/page.tsx
  admin/dashboard/page.tsx
  admin/dashboard/trash/page.tsx
  admin/dashboard/settings/page.tsx
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
  auth.ts
  constants.ts
  csv.ts
  dates.ts
  peserta.ts
  settings.ts
  supabase/server.ts
  validations.ts
  whatsapp.ts

types/
  api.ts
  peserta.ts
  settings.ts

middleware.ts
.env.local.example
tailwind.config.ts
```

---

## Task 1: Initialize Next.js, Dependencies, Theme

**Files:**

- Create/modify: `package.json`
- Create/modify: `tailwind.config.ts`
- Create/modify: `app/globals.css`
- Create/modify: `app/layout.tsx`
- Create: `.env.local.example`

**Interfaces:**

- Produces a runnable Next.js app using project visual tokens.

- [ ] **Step 1: Scaffold Next.js app**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install @supabase/supabase-js react-hook-form zod @hookform/resolvers papaparse date-fns date-fns-tz lucide-react clsx tailwind-merge sonner
npm install -D @types/papaparse
```

- [ ] **Step 3: Add `typecheck` script**

Add this to `package.json` scripts:

```json
{
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Initialize shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button input select textarea label dialog card table badge dropdown-menu sheet separator alert-dialog
```

- [ ] **Step 5: Configure fonts and theme tokens**

Use Inter for body and Playfair Display for headings. Use these core colors from `.docs/DESIGN_WEB_PUBLIC.md` and `.docs/DESIGN_DASHBOARD.md`:

```ts
const themeColors = {
  cream: "#fdf9e9",
  creamMuted: "#f8f4e4",
  emerald: "#003527",
  emeraldSoft: "#064e3b",
  gold: "#fed65b",
  brown: "#735c00",
  slate: "#0d1c2e",
  danger: "#ba1a1a",
};
```

Implementation must map these into Tailwind/shadcn CSS variables so landing page and dashboard do not fall back to default shadcn gray-only styling.

- [ ] **Step 6: Create env template**

Create `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

- [ ] **Step 7: Verify**

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Task 2: Create Domain Types and Constants

**Files:**

- Create: `types/peserta.ts`
- Create: `types/settings.ts`
- Create: `types/api.ts`
- Create: `lib/constants.ts`

**Interfaces:**

- Produces typed domain objects used by validation, API, and UI.

- [ ] **Step 1: Define participant types**

Create `types/peserta.ts`:

```ts
export type JenisKendaraan = "motor" | "mobil" | "angkutan_umum";

export type TipeWaktu = "jam_pasti" | "fleksibel";

export type Peserta = {
  id: string;
  nama: string;
  nomor_wa: string;
  menginap: boolean;
  asal: string;
  membawa_rombongan: boolean;
  jumlah_rombongan: number | null;
  tipe_waktu_berangkat: TipeWaktu;
  waktu_berangkat: string | null;
  deskripsi_berangkat: string | null;
  tipe_waktu_kepulangan: TipeWaktu;
  waktu_kepulangan: string | null;
  deskripsi_kepulangan: string | null;
  jenis_kendaraan: JenisKendaraan;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
```

- [ ] **Step 2: Define settings type**

Create `types/settings.ts`:

```ts
export type Settings = {
  id: string;
  registration_open_at: string;
  registration_close_at: string;
  contact_person_wa: string;
  updated_at: string;
};
```

- [ ] **Step 3: Define API shared types**

Create `types/api.ts`:

```ts
export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Array<{ path: string[]; message: string }>;
};
```

- [ ] **Step 4: Define constants**

Create `lib/constants.ts`:

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

export const JENIS_KENDARAAN = [
  { value: "motor", label: "Motor" },
  { value: "mobil", label: "Mobil" },
  { value: "angkutan_umum", label: "Angkutan Umum" },
] as const;

export const ADMIN_SESSION_COOKIE = "admin_session";
```

- [ ] **Step 5: Verify**

```bash
npm run lint
npm run typecheck
```

---

## Task 3: Zod Validation and Canonicalization

**Files:**

- Create: `lib/validations.ts`
- Create: `lib/dates.ts`

**Interfaces:**

- Produces `registerPesertaSchema`, `canonicalizeRegisterInput`, `updateSettingsSchema`, `formatToWIB`, and `isWithinRegistrationWindow`.

- [ ] **Step 1: Implement registration schema with explicit toggles**

Create `lib/validations.ts` with these rules:

```ts
import { z } from "zod";
import { KABUPATEN_KALBAR } from "@/lib/constants";

const nomorWaSchema = z.string().regex(/^(08|628)[0-9]{8,13}$/, "Nomor Whatsapp Tidak Valid!");

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
  if (data.membawa_rombongan && data.jumlah_rombongan === null) {
    ctx.addIssue({ code: "custom", path: ["jumlah_rombongan"], message: "Harap Jumlah Rombongan diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_berangkat === "jam_pasti" && !data.waktu_berangkat) {
    ctx.addIssue({ code: "custom", path: ["waktu_berangkat"], message: "Harap Waktu Berangkat diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_berangkat === "fleksibel" && !data.deskripsi_berangkat) {
    ctx.addIssue({ code: "custom", path: ["deskripsi_berangkat"], message: "Harap Deskripsi Waktu Berangkat diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_kepulangan === "jam_pasti" && !data.waktu_kepulangan) {
    ctx.addIssue({ code: "custom", path: ["waktu_kepulangan"], message: "Harap Waktu Kepulangan diisi terlebih dahulu!" });
  }

  if (data.tipe_waktu_kepulangan === "fleksibel" && !data.deskripsi_kepulangan) {
    ctx.addIssue({ code: "custom", path: ["deskripsi_kepulangan"], message: "Harap Deskripsi Waktu Kepulangan diisi terlebih dahulu!" });
  }
});

export type RegisterPesertaInput = z.infer<typeof registerPesertaSchema>;
```

- [ ] **Step 2: Implement canonicalizer**

Add to `lib/validations.ts`:

```ts
export function canonicalizeRegisterInput(input: RegisterPesertaInput): RegisterPesertaInput {
  return {
    ...input,
    // Jika tidak membawa rombongan, database harus menyimpan null supaya headcount tidak ambigu.
    jumlah_rombongan: input.membawa_rombongan ? input.jumlah_rombongan : null,
    // Jika user memilih jam pasti, field deskripsi harus dikosongkan agar UI/dashboard tidak menampilkan data ganda.
    deskripsi_berangkat: input.tipe_waktu_berangkat === "jam_pasti" ? null : input.deskripsi_berangkat,
    waktu_berangkat: input.tipe_waktu_berangkat === "fleksibel" ? null : input.waktu_berangkat,
    deskripsi_kepulangan: input.tipe_waktu_kepulangan === "jam_pasti" ? null : input.deskripsi_kepulangan,
    waktu_kepulangan: input.tipe_waktu_kepulangan === "fleksibel" ? null : input.waktu_kepulangan,
  };
}

export const updateSettingsSchema = z.object({
  registration_open_at: z.string().datetime(),
  registration_close_at: z.string().datetime(),
  contact_person_wa: nomorWaSchema,
}).refine((data) => new Date(data.registration_close_at) > new Date(data.registration_open_at), {
  path: ["registration_close_at"],
  message: "Waktu tutup harus setelah waktu buka pendaftaran",
});
```

- [ ] **Step 3: Implement WIB helpers**

Create `lib/dates.ts`:

```ts
import { formatInTimeZone } from "date-fns-tz";
import type { Settings } from "@/types/settings";

export function formatToWIB(isoString: string | null): string {
  if (!isoString) return "-";
  return formatInTimeZone(new Date(isoString), "Asia/Jakarta", "dd MMM yyyy, HH:mm 'WIB'");
}

export function isWithinRegistrationWindow(settings: Pick<Settings, "registration_open_at" | "registration_close_at">, now = new Date()): boolean {
  return now >= new Date(settings.registration_open_at) && now <= new Date(settings.registration_close_at);
}
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run typecheck
```

---

## Task 4: Supabase Client and Data Helpers

**Files:**

- Create: `lib/supabase/server.ts`
- Create: `lib/settings.ts`
- Create: `lib/peserta.ts`

**Interfaces:**

- Produces all database helper functions for public and admin APIs.

- [ ] **Step 1: Create server-side Supabase client**

Create `lib/supabase/server.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  {
    auth: {
      persistSession: false,
    },
  }
);
```

- [ ] **Step 2: Create settings helper with fallback**

Create `lib/settings.ts`:

```ts
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Settings } from "@/types/settings";

export const FALLBACK_SETTINGS: Settings = {
  id: "fallback-settings",
  registration_open_at: "2026-08-01T00:00:00.000Z",
  registration_close_at: "2026-08-18T17:00:00.000Z",
  contact_person_wa: "081234567890",
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Fallback mencegah halaman publik crash jika settings belum di-seed.
    return FALLBACK_SETTINGS;
  }

  return data;
}
```

- [ ] **Step 3: Create peserta helpers**

Create `lib/peserta.ts` with functions:

```ts
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Peserta } from "@/types/peserta";
import type { RegisterPesertaInput } from "@/lib/validations";

export type PesertaFilters = {
  search?: string;
  asal?: string;
  menginap?: "true" | "false";
  kendaraan?: "motor" | "mobil" | "angkutan_umum";
  rombongan?: "true" | "false";
};

export function getPesertaHeadcount(peserta: Pick<Peserta, "membawa_rombongan" | "jumlah_rombongan">): number {
  return peserta.membawa_rombongan ? 1 + (peserta.jumlah_rombongan ?? 0) : 1;
}

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
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
```

Also implement:

```ts
getActivePeserta(filters: PesertaFilters): Promise<Peserta[]>
getDeletedPeserta(): Promise<Peserta[]>
softDeletePeserta(id: string): Promise<void>
restorePeserta(id: string): Promise<void>
permanentDeletePeserta(id: string): Promise<void>
getSummary(): Promise<{
  total_headcount: number;
  total_menginap: number;
  total_motor: number;
  total_mobil: number;
  total_angkutan_umum: number;
  total_paket_makan: number;
}>
```

`getSummary()` must calculate from active rows using `getPesertaHeadcount()`, not row count.

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run typecheck
```

---

## Task 5: Public API Routes

**Files:**

- Create: `app/api/settings/route.ts`
- Create: `app/api/peserta/register/route.ts`

**Interfaces:**

- Consumes helpers from Task 3 and Task 4.
- Produces public endpoints in `.docs/API_CONTRACT.md`.

- [ ] **Step 1: Implement `GET /api/settings`**

Return settings from `getSettings()` with status `200` even when fallback is used.

- [ ] **Step 2: Implement `POST /api/peserta/register`**

Required behavior:

1. Parse body.
2. Validate with `registerPesertaSchema.safeParse()`.
3. Canonicalize using `canonicalizeRegisterInput()`.
4. Check registration window using `isWithinRegistrationWindow()`.
5. Optionally pre-check duplicate WA for better UX.
6. Insert to Supabase.
7. Catch Postgres `23505` and return duplicate WA response.

Duplicate handling must look for Supabase/PostgREST error code:

```ts
if (error && typeof error === "object" && "code" in error && error.code === "23505") {
  return NextResponse.json(
    { success: false, message: "Nomor sudah terdaftar. Silahkan gunakan nomor lain" },
    { status: 409 }
  );
}
```

Validation errors must include path/message array.

- [ ] **Step 3: Verify manually**

Test these cases:

- Valid registration succeeds.
- Invalid WA returns `Nomor Whatsapp Tidak Valid!`.
- Flexible departure attaches error to `deskripsi_berangkat`, not `waktu_berangkat`.
- Duplicate WA returns status `409`.
- Closed registration returns status `403`.

- [ ] **Step 4: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 6: Signed Admin Authentication

**Files:**

- Create: `lib/auth.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `middleware.ts`
- Create: `app/admin/layout.tsx`

**Interfaces:**

- Produces signed cookie auth for `/admin/*` routes.

- [ ] **Step 1: Implement signed token helpers**

Create `lib/auth.ts` with Web Crypto HMAC helpers:

```ts
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const encoder = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET belum dikonfigurasi");

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(signature).toString("base64url");
}

export async function createAdminSessionToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmac(payload);
  return signature === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
```

- [ ] **Step 2: Implement login route**

`app/api/auth/login/route.ts` must:

- Compare submitted password against `process.env.ADMIN_PASSWORD`.
- Create signed token via `createAdminSessionToken()`.
- Set cookie with:

```ts
{
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
}
```

- [ ] **Step 3: Implement logout route**

Delete cookie by name and path `/`.

- [ ] **Step 4: Implement middleware**

Middleware must protect all `/admin/*` except `/admin/login`. If middleware cannot call async HMAC in target Next version, move verification into `app/admin/layout.tsx` and make middleware only check cookie presence.

- [ ] **Step 5: Verify locally**

- Login works on `http://localhost:3000`.
- Cookie is saved locally because `secure` is false in development.
- Editing cookie value manually invalidates session.
- Logout clears session.

- [ ] **Step 6: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 7: Public Landing Page

**Files:**

- Create: `app/page.tsx`
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/AboutSection.tsx`
- Create: `components/landing/FasilitasSection.tsx`
- Create: `components/landing/RundownSection.tsx`
- Create: `components/landing/LokasiSection.tsx`
- Create: `components/landing/CTASection.tsx`
- Create: `lib/whatsapp.ts`

**Interfaces:**

- Consumes theme from Task 1 and settings contact WA.

- [ ] **Step 1: Build landing sections**

Follow `.docs/DESIGN_WEB_PUBLIC.md`. Include:

- Hero with title, subtitle, date, pemateri placeholder, CTA.
- Tentang Dauroh.
- Fasilitas.
- Rundown 3 days.
- Lokasi with map embed/link/copy coordinate.
- Final CTA with WhatsApp contact.

- [ ] **Step 2: Implement WhatsApp helper**

Create `lib/whatsapp.ts`:

```ts
export function buildWhatsAppUrl(nomorWa: string, message: string): string {
  const normalized = nomorWa.startsWith("08") ? `62${nomorWa.slice(1)}` : nomorWa;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 3: Verify responsive layout**

Check mobile and desktop viewport manually.

- [ ] **Step 4: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 8: Registration UI and Confirmation

**Files:**

- Create: `app/register/page.tsx`
- Create: `app/register/success/page.tsx`
- Create: `components/register/RegistrationForm.tsx`
- Create: `components/register/TimeToggleField.tsx`
- Create: `components/register/ClosedRegistration.tsx`
- Create: `components/register/ConfirmationSummary.tsx`

**Interfaces:**

- Consumes `registerPesertaSchema`, `/api/settings`, `/api/peserta/register`.

- [ ] **Step 1: Implement closed registration state**

If current time is outside settings window, hide form and show:

```txt
Pendaftaran Tidak Tersedia
```

Include button back to landing page.

- [ ] **Step 2: Implement time toggle fields**

Each time section must control both type and value:

```ts
tipe_waktu_berangkat: "jam_pasti" | "fleksibel"
waktu_berangkat: string | null
deskripsi_berangkat: string | null
```

Same for kepulangan.

- [ ] **Step 3: Implement form submit**

On API response:

- `200`: show success toast and navigate to confirmation.
- `400`: show first validation error toast.
- `403`: show `Pendaftaran Tidak Tersedia`.
- `409`: show duplicate WA warning toast.

- [ ] **Step 4: Verify manually**

- Jam pasti departure error appears under datetime field.
- Flexible departure error appears under textarea field.
- `membawa_rombongan = false` sends `jumlah_rombongan = null`.
- Confirmation page shows submitted summary.

- [ ] **Step 5: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 9: Admin Dashboard APIs

**Files:**

- Create: `app/api/admin/peserta/route.ts`
- Create: `app/api/admin/peserta/[id]/route.ts`
- Create: `app/api/admin/peserta/summary/route.ts`
- Create: `app/api/admin/peserta/trash/route.ts`
- Create: `app/api/admin/peserta/[id]/restore/route.ts`
- Create: `app/api/admin/peserta/[id]/permanent/route.ts`
- Create: `app/api/admin/peserta/export/csv/route.ts`
- Create: `app/api/admin/settings/route.ts`
- Create: `lib/csv.ts`

**Interfaces:**

- Must match `.docs/API_CONTRACT.md` exactly.

- [ ] **Step 1: Implement `GET /api/admin/peserta`**

Support query params:

```txt
search, asal, menginap, kendaraan, rombongan
```

Return active rows only.

- [ ] **Step 2: Implement `GET` and `DELETE /api/admin/peserta/[id]`**

`DELETE` performs soft-delete:

```ts
is_deleted = true
deleted_at = new Date().toISOString()
```

- [ ] **Step 3: Implement `GET /api/admin/peserta/summary`**

Summary must use active rows only and headcount formula:

```ts
const headcount = peserta.membawa_rombongan ? 1 + (peserta.jumlah_rombongan ?? 0) : 1;
```

Vehicle totals count participant rows by vehicle, not headcount, unless user later changes this requirement.

- [ ] **Step 4: Implement Trash endpoints**

- `GET /api/admin/peserta/trash`
- `PATCH /api/admin/peserta/[id]/restore`
- `DELETE /api/admin/peserta/[id]/permanent`

Permanent delete must only target rows with `is_deleted = true`.

- [ ] **Step 5: Implement settings admin endpoint**

- `GET /api/admin/settings`
- `PATCH /api/admin/settings`

Validate with `updateSettingsSchema`.

- [ ] **Step 6: Implement CSV endpoint/helper**

Create `lib/csv.ts`:

```ts
export function formatWaForCsv(nomorWa: string): string {
  // Format formula Excel agar angka nol awal WhatsApp tidak hilang saat dibuka di spreadsheet.
  return `="${nomorWa}"`;
}
```

CSV must export active rows only and include `headcount` and `paket_makan` columns.

- [ ] **Step 7: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 10: Admin Dashboard UI

**Files:**

- Create: `components/admin/AdminShell.tsx`
- Create: `components/admin/AdminSidebar.tsx`
- Create: `app/admin/dashboard/page.tsx`
- Create: `components/admin/SummaryCards.tsx`
- Create: `components/admin/FilterBar.tsx`
- Create: `components/admin/PesertaTable.tsx`
- Create: `components/admin/PesertaDetailModal.tsx`
- Create: `components/admin/ExportCsvButton.tsx`

**Interfaces:**

- Consumes admin API routes from Task 9.

- [ ] **Step 1: Build admin shell**

Follow `.docs/DESIGN_DASHBOARD.md`: sidebar desktop, mobile drawer/topbar, calm operational style.

- [ ] **Step 2: Build summary cards**

Show:

- Total Headcount
- Total Menginap
- Total Motor
- Total Mobil
- Total Angkutan Umum
- Total Paket Makan

- [ ] **Step 3: Build filter/search UI**

Filters:

- Menginap
- Asal
- Kendaraan
- Rombongan

Search by name and WhatsApp.

- [ ] **Step 4: Build peserta table and modal**

Rows show table fields. Modal shows full participant details and delete action with confirmation.

- [ ] **Step 5: Build export button**

Download CSV using API endpoint or client-side PapaParse helper.

- [ ] **Step 6: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 11: Trash UI

**Files:**

- Create: `app/admin/dashboard/trash/page.tsx`
- Create: `components/admin/TrashTable.tsx`

**Interfaces:**

- Consumes Trash endpoints from Task 9.

- [ ] **Step 1: Build Trash page**

Show deleted rows with `deleted_at`.

- [ ] **Step 2: Implement Restore action**

Call `PATCH /api/admin/peserta/[id]/restore`.

- [ ] **Step 3: Implement Permanent Delete action**

Use destructive confirmation dialog. Call `DELETE /api/admin/peserta/[id]/permanent`.

- [ ] **Step 4: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 12: Settings UI

**Files:**

- Create: `app/admin/dashboard/settings/page.tsx`
- Create: `components/admin/SettingsForm.tsx`

**Interfaces:**

- Consumes `GET/PATCH /api/admin/settings`.

- [ ] **Step 1: Build settings form**

Fields:

- Waktu Buka Pendaftaran
- Waktu Tutup Pendaftaran
- Nomor WhatsApp Contact Person

- [ ] **Step 2: Validate close after open**

Client and server must reject invalid order.

- [ ] **Step 3: Verify effect on public form**

Set close time in the past and confirm registration page shows closed state.

- [ ] **Step 4: Verify commands**

```bash
npm run lint
npm run typecheck
```

---

## Task 13: Final QA and Deployment Readiness

**Files:**

- Modify any files found during QA.

**Interfaces:**

- Produces deployable Vercel app.

- [ ] **Step 1: Run full verification**

```bash
npm run lint
npm run typecheck
npm run build
```

- [ ] **Step 2: Manual test public flow**

- Landing page loads.
- CTA register works.
- WhatsApp CTA works.
- Closed registration state works.
- Valid participant registration works.
- Duplicate WhatsApp returns correct warning.
- Confirmation page shows correct data.

- [ ] **Step 3: Manual test admin flow**

- Login works locally.
- Forged/edited cookie fails.
- Dashboard summary uses headcount.
- Search/filter works.
- CSV preserves WhatsApp number.
- Soft delete removes participant from active summary/export.
- Trash restore returns participant.
- Permanent delete removes row.
- Settings update affects public form.

- [ ] **Step 4: Prepare Vercel environment variables**

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

---

## Self-Review Notes

- Zod time validation uses explicit toggle fields to avoid error-path confusion.
- Duplicate WhatsApp is protected by DB unique constraint and `23505` handling.
- `jumlah_rombongan` normalization is mandatory before insert.
- Signed admin cookie replaces plain `authenticated` cookie.
- Cookie secure flag supports localhost.
- CSV WhatsApp formatting protects leading zero.
- Settings helper uses fallback to avoid `.single()` crash when seed is missing.
- Tailwind theme must use design tokens from Stitch design docs.
