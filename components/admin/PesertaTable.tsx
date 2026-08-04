"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Loader2, ClipboardCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PesertaDetailModal from "@/components/admin/PesertaDetailModal";
import FilterBar from "@/components/admin/FilterBar";
import type { FilterValues } from "@/components/admin/FilterBar";
import type { Peserta } from "@/types/peserta";
import { getPesertaHeadcount } from "@/lib/headcount";
import { formatToWIB } from "@/lib/dates";
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

// Tabel daftar peserta dengan fitur filter, search, detail, dan hapus
export default function PesertaTable({
  onFilterOpenChange,
  scrollOnFilter,
}: {
  onFilterOpenChange?: (open: boolean) => void;
  scrollOnFilter?: boolean;
}) {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Peserta | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    asal: "",
    menginap: "",
    kendaraan: "",
    rombongan: "",
  });
  const [markingId, setMarkingId] = useState<string | null>(null);

  // Memuat data peserta berdasarkan filter
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.asal) params.set("asal", filters.asal);
        if (filters.menginap) params.set("menginap", filters.menginap);
        if (filters.kendaraan) params.set("kendaraan", filters.kendaraan);
        if (filters.rombongan) params.set("rombongan", filters.rombongan);

        const res = await fetch(`/api/admin/peserta?${params}`);
        if (res.ok) {
          const body = await res.json();
          if (!cancelled) setPeserta(body.data ?? []);
        }
      } catch {
        // Silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  function handleFilter(f: FilterValues) {
    setFilters(f);
  }

  function openDetail(p: Peserta) {
    setSelected(p);
    setModalOpen(true);
  }

  async function handleQuickDelete(id: string) {
    try {
      await fetch(`/api/admin/peserta/${id}`, { method: "DELETE" });
      setPeserta((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Silent
    }
  }

  async function handleToggleHadir(p: Peserta) {
    if (markingId === p.id) return;
    const target = !p.is_hadir;
    setMarkingId(p.id);
    try {
      const res = await fetch(`/api/admin/peserta/${p.id}/kehadiran`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hadir: target }),
      });
      if (res.ok) {
        setPeserta((prev) =>
          prev.map((x) =>
            x.id === p.id
              ? {
                  ...x,
                  is_hadir: target,
                  hadir_at: target ? new Date().toISOString() : null,
                }
              : x,
          ),
        );
        window.dispatchEvent(new Event("kehadiran-updated"));
      }
    } catch {
      // Silent
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 ${scrollOnFilter ? "" : "flex-1 min-h-0"}`}
    >
      <div className="shrink-0">
        <FilterBar
          onFilter={handleFilter}
          onFilterOpenChange={onFilterOpenChange}
        />
      </div>

      <div
        className={`rounded-lg border border-[#e2e8f0] bg-white relative  ${scrollOnFilter ? "" : "flex-1 min-h-0 overflow-auto scrollbar-thin"}`}
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
            <TableRow className="bg-gray-50">
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                No
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Nama
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                WA
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Asal
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Menginap
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Rombongan
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Total Rombongan
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Hadir
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Tgl Daftar
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : peserta.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Belum ada peserta
                </TableCell>
              </TableRow>
            ) : (
              peserta.map((p, i) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-emerald/5"
                  onClick={() => openDetail(p)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-800">
                    {p.nama}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {p.nomor_wa}
                  </TableCell>
                  <TableCell className="text-sm">{p.asal}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        p.menginap
                          ? "bg-emerald/10 text-emerald"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {p.menginap ? "Ya" : "Tidak"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        p.membawa_rombongan
                          ? "bg-emerald/10 text-emerald"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {p.membawa_rombongan ? "Ya" : "Tidak"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {getPesertaHeadcount(
                      p.membawa_rombongan,
                      p.jumlah_rombongan,
                    )}
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        variant="secondary"
                        className={
                          p.is_hadir
                            ? "bg-emerald/10 text-emerald"
                            : "bg-slate-100 text-slate-500"
                        }
                      >
                        {p.is_hadir ? "Hadir" : "Tidak"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-emerald hover:text-emerald"
                        onClick={() => handleToggleHadir(p)}
                        disabled={markingId === p.id}
                      >
                        {markingId === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatToWIB(p.created_at)}
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openDetail(p)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {p.nama} akan dipindahkan ke trash.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleQuickDelete(p.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
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

      {selected && (
        <PesertaDetailModal
          peserta={selected}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onDeleted={() => setFilters((prev) => ({ ...prev }))}
          onUpdated={(updated) => {
            setPeserta((prev) =>
              prev.map((x) => (x.id === updated.id ? updated : x)),
            );
            setSelected(updated);
            window.dispatchEvent(new Event("kehadiran-updated"));
          }}
        />
      )}
    </div>
  );
}
