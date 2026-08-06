"use client";

import { toast } from "sonner";

let activeToastId: string | number | null = null;

// Menampilkan toast "Tunggu Sebentar..." saat navigasi ke halaman register
// sedang berlangsung. Mengganti toast sebelumnya jika masih aktif.
export function showRegisterLoadingToast(): void {
  if (activeToastId !== null) {
    toast.dismiss(activeToastId);
  }
  activeToastId = toast.loading("Tunggu Sebentar...");
}

// Menghilangkan toast loading setelah halaman register berhasil dirender.
export function dismissRegisterLoadingToast(): void {
  if (activeToastId === null) return;
  toast.dismiss(activeToastId);
  activeToastId = null;
}
