"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Peserta } from "@/types/peserta";
import { getPesertaHeadcount } from "@/lib/headcount";
import { formatToWIB } from "@/lib/dates";

// Layar check-in hari-H: pencarian cepat dan penandaan hadir peserta
export default function CheckInDesk() {
  const [search, setSearch] = useState("");
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    total_hadir: number;
    total_headcount: number;
  } | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input untuk scan cepat
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Memuat daftar peserta dengan debounce pada pencarian
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
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
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  // Memuat ulang ringkasan kehadiran
  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        const res = await fetch("/api/admin/peserta/summary");
        if (res.ok) {
          const body = await res.json();
          if (!cancelled) {
            setSummary({
              total_hadir: body.total_hadir ?? 0,
              total_headcount: body.total_headcount ?? 0,
            });
          }
        }
      } catch {
        // Silent
      }
    }

    loadSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tandai hadir atau batalkan tanda hadir peserta
  async function handleToggle(p: Peserta) {
    setMarkingId(p.id);
    try {
      const res = await fetch(`/api/admin/peserta/${p.id}/kehadiran`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hadir: !p.is_hadir }),
      });
      if (res.ok) {
        setPeserta((prev) =>
          prev.map((x) =>
            x.id === p.id
              ? {
                  ...x,
                  is_hadir: !x.is_hadir,
                  hadir_at: !x.is_hadir ? new Date().toISOString() : null,
                }
              : x
          )
        );
        // Refresh ringkasan setelah perubahan
        const summaryRes = await fetch("/api/admin/peserta/summary");
        if (summaryRes.ok) {
          const body = await summaryRes.json();
          setSummary({
            total_hadir: body.total_hadir ?? 0,
            total_headcount: body.total_headcount ?? 0,
          });
        }
      }
    } catch {
      // Silent
    } finally {
      setMarkingId(null);
      inputRef.current?.focus();
    }
  }

  // Enter: tandai/batalkan peserta pertama dari hasil pencarian
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && peserta.length > 0 && !markingId) {
      handleToggle(peserta[0]);
    }
  }

  const totalHadir = summary?.total_hadir ?? 0;
  const totalHeadcount = summary?.total_headcount ?? 0;

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4">
      {/* Header ringkas */}
      <div className="shrink-0">
        <h1 className="font-serif text-2xl font-bold text-emerald">
          Check-in Peserta
        </h1>
        <p className="text-sm text-muted-foreground">
          Registrasi ulang peserta saat hari-H.
        </p>
      </div>

      {/* Counter kehadiran */}
      <div className="shrink-0 rounded-lg border border-emerald/30 bg-emerald/5 p-4 text-center">
        <p className="text-3xl font-bold text-emerald">
          {totalHadir}
          <span className="text-lg font-normal text-muted-foreground">
            {" "}
            dari {totalHeadcount}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">sudah hadir</p>
      </div>

      {/* Pencarian besar */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari nama atau nomor WA..."
          className="h-12 pl-9 text-base"
        />
      </div>

      {/* Daftar hasil */}
      <div className="flex-1 min-h-0 space-y-2 overflow-auto scrollbar-thin">
        {loading ? (
          <div className="py-10 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : peserta.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Tidak ada peserta
          </p>
        ) : (
          peserta.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-lg border border-[#e2e8f0] bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-800">{p.nama}</p>
                <p className="text-sm text-muted-foreground">{p.asal}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {p.nomor_wa}
                </p>
                <p className="text-xs text-muted-foreground">
                  Headcount: {getPesertaHeadcount(p.membawa_rombongan, p.jumlah_rombongan)}
                </p>
              </div>
              {p.is_hadir ? (
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Button
                    variant="outline"
                    onClick={() => handleToggle(p)}
                    disabled={markingId === p.id}
                    className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {markingId === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Batal
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Hadir {formatToWIB(p.hadir_at)}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => handleToggle(p)}
                  disabled={markingId === p.id}
                  className="gap-2 bg-emerald hover:bg-emerald/85"
                >
                  {markingId === p.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ClipboardCheck className="h-4 w-4" />
                  )}
                  Tandai Hadir
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
