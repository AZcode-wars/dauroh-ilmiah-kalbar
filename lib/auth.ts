import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const encoder = new TextEncoder();

// Membuat signature HMAC-SHA256 untuk payload session admin
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
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Membuat token session baru: payload (admin:timestamp) + signature HMAC
export async function createAdminSessionToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

// Memverifikasi token session dengan mengecek signature HMAC
export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmac(payload);
  return signature === expected;
}

// Cek apakah admin sudah terautentikasi berdasarkan cookie session
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
