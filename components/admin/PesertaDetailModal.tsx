"use client";

import { useState } from "react";
import { formatToWIB } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Trash2, Loader2, ClipboardCheck } from "lucide-react";
import type { Peserta } from "@/types/peserta";
import { JENIS_KENDARAAN } from "@/lib/constants";

type PesertaDetailModalProps = {
  peserta: Peserta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
  onUpdated?: (peserta: Peserta) => void;
};

// Modal detail peserta dengan informasi lengkap dan tombol hapus
export default function PesertaDetailModal({
  peserta,
  open,
  onOpenChange,
  onDeleted,
  onUpdated,
}: PesertaDetailModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/peserta/${peserta.id}`, { method: "DELETE" });
      onDeleted();
      onOpenChange(false);
    } catch {
      // Silent — error handled by parent
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleHadir() {
    setMarking(true);
    try {
      const res = await fetch(`/api/admin/peserta/${peserta.id}/kehadiran`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hadir: !peserta.is_hadir }),
      });
      if (res.ok) {
        const updated: Peserta = {
          ...peserta,
          is_hadir: !peserta.is_hadir,
          hadir_at: !peserta.is_hadir ? new Date().toISOString() : null,
        };
        onUpdated?.(updated);
      }
    } catch {
      // Silent — error handled by parent
    } finally {
      setMarking(false);
    }
  }

  const kendaraanLabel = JENIS_KENDARAAN.find((k) => k.value === peserta.jenis_kendaraan)?.label;
  const headcount = peserta.membawa_rombongan ? 1 + (peserta.jumlah_rombongan ?? 0) : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-emerald">
            {peserta.nama}
          </DialogTitle>
          <DialogDescription>
            Detail lengkap data peserta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={
                peserta.menginap
                  ? "bg-emerald/10 text-emerald"
                  : "bg-slate-100 text-slate-500"
              }
            >
              {peserta.menginap ? "Menginap" : "Tidak Menginap"}
            </Badge>
            {peserta.membawa_rombongan && (
              <Badge variant="secondary" className="bg-gold/10 text-brown">
                Rombongan ({peserta.jumlah_rombongan} org)
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={
                peserta.is_hadir
                  ? "bg-emerald/10 text-emerald"
                  : "bg-slate-100 text-slate-500"
              }
            >
              {peserta.is_hadir ? "Hadir" : "Belum Hadir"}
            </Badge>
            <Badge variant="secondary">{kendaraanLabel}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#e2e8f0] bg-gray-50/50 p-4">
            <DataRow label="Nomor WA" value={peserta.nomor_wa} />
            <DataRow label="Asal" value={peserta.asal} />
            <DataRow label="Headcount" value={`${headcount} orang`} />
            <DataRow
              label="Keberangkatan"
              value={
                peserta.tipe_waktu_berangkat === "jam_pasti"
                  ? formatToWIB(peserta.waktu_berangkat)
                  : peserta.deskripsi_berangkat ?? "-"
              }
            />
            <DataRow
              label="Kepulangan"
              value={
                peserta.tipe_waktu_kepulangan === "jam_pasti"
                  ? formatToWIB(peserta.waktu_kepulangan)
                  : peserta.deskripsi_kepulangan ?? "-"
              }
            />
            <DataRow label="Tgl Daftar" value={formatToWIB(peserta.created_at)} />
          </div>
        </div>

        {/* Tombol Tandai Hadir / Batal Hadir */}
        <Button
          variant={peserta.is_hadir ? "destructive" : "default"}
          className={`w-full gap-2 ${peserta.is_hadir ? "" : "bg-emerald hover:bg-emerald-soft"}`}
          onClick={handleToggleHadir}
          disabled={marking}
        >
          {marking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="h-4 w-4" />
          )}
          {peserta.is_hadir ? "Batal Hadir" : "Tandai Hadir"}
        </Button>

        {/* Tombol Hapus dengan konfirmasi */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full gap-2">
              <Trash2 className="h-4 w-4" />
              Hapus Peserta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
              <AlertDialogDescription>
                Peserta akan dipindahkan ke trash dan bisa dipulihkan kembali.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ya, Hapus"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

// Baris data label-value di dalam modal detail
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-medium text-gray-800">{value}</p>
    </div>
  );
}
