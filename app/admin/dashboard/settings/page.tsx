"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Halaman pengaturan pendaftaran: waktu buka/tutup, nomor kontak, dan zona bahaya hapus semua data
export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleDeleteAll() {
    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/peserta/all", { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json();
        setMessage({ type: "error", text: err.message || "Gagal menghapus data" });
        return;
      }

      setMessage({ type: "success", text: "Semua data peserta berhasil dihapus permanen" });
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="font-serif text-2xl font-bold text-emerald">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Atur jadwal pendaftaran dan nomor kontak panitia
        </p>
      </div>

      <SettingsForm />

      {/* Zona Bahaya — Hapus Semua Data */}
      <div className="rounded-lg border border-red-200 bg-red-50/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-red-700">Zona Berbahaya</h2>
            <p className="mt-1 text-sm text-red-600">
              Menghapus seluruh data peserta secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="shrink-0 gap-2 border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Semua Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-700">Hapus Semua Data Permanen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seluruh data peserta akan dihapus secara permanen dari database dan tidak dapat dikembalikan. 
                  Pastikan Anda telah mencadangkan data yang diperlukan sebelum melanjutkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Ya, Hapus Semua"
                  )}
            </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-md px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-emerald/10 text-emerald"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
