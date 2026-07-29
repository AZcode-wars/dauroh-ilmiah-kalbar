"use client";

import { useEffect, useState } from "react";
import { Undo2, Skull, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatToWIB } from "@/lib/dates";
import type { Peserta } from "@/types/peserta";

// Tabel data peserta yang sudah di-soft-delete, dengan tombol restore dan hapus permanen
export default function TrashTable() {
  const [trashed, setTrashed] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);

  // Memuat data trash
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/peserta/trash");
        if (res.ok) {
          const body = await res.json();
          if (!cancelled) setTrashed(body.data ?? []);
        }
      } catch {
        // Silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function handleRestore(id: string) {
    try {
      await fetch(`/api/admin/peserta/${id}/restore`, { method: "PATCH" });
      setTrashed((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Silent
    }
  }

  async function handlePermanentDelete(id: string) {
    try {
      await fetch(`/api/admin/peserta/${id}/permanent`, { method: "DELETE" });
      setTrashed((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Silent
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto scrollbar-thin rounded-lg border border-[#e2e8f0] bg-white relative">
      <Table>
        <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
          <TableRow className="bg-gray-50">
            <TableHead className="w-10 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              No
            </TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              Nama
            </TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              WA
            </TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              Dihapus Pada
            </TableHead>
            <TableHead className="w-32 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : trashed.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                Trash kosong
              </TableCell>
            </TableRow>
          ) : (
            trashed.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="text-sm font-medium text-gray-800">{p.nama}</TableCell>
                <TableCell className="font-mono text-xs">{p.nomor_wa}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatToWIB(p.deleted_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(p.id)}
                      className="h-8 gap-1 text-emerald hover:text-emerald-soft"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      Pulihkan
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-red-500 hover:text-red-600"
                        >
                          <Skull className="h-3.5 w-3.5" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Permanen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Data {p.nama} akan dihapus secara permanen dan tidak bisa dikembalikan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handlePermanentDelete(p.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ya, Hapus Permanen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
