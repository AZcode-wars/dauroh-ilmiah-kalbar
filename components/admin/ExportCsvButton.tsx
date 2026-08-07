"use client";

import { useState } from "react";
import { Download, Loader2, ChevronDown, ClipboardCopy, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Peserta } from "@/types/peserta";
import { buildFormatPeserta, buildFormatKonsumsi } from "@/lib/pesertaExport";
import type { ExportSummary } from "@/lib/pesertaExport";

export default function ExportCsvButton() {
  const [exporting, setExporting] = useState(false);
  const [copying, setCopying] = useState<"peserta" | "konsumsi" | null>(null);

  // Ekspor CSV yang sudah ada
  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/peserta/export/csv");
      if (!res.ok) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data-peserta-dauroh.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silent
    } finally {
      setExporting(false);
    }
  }

  // Mengambil data peserta aktif + ringkasan untuk menyusun text yang akan disalin
  async function getData() {
    const [pesertaRes, summaryRes] = await Promise.all([
      fetch("/api/admin/peserta"),
      fetch("/api/admin/peserta/summary"),
    ]);

    if (!pesertaRes.ok || !summaryRes.ok) {
      throw new Error("Gagal mengambil data peserta");
    }

    const pesertaBody = await pesertaRes.json();
    const summary = (await summaryRes.json()) as ExportSummary;
    return { pesertaList: (pesertaBody.data ?? []) as Peserta[], summary };
  }

  // Menyalin teks ke clipboard dengan fallback textarea untuk browser lama
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }
  }

  // Menyalin format peserta (grouping per asal) ke clipboard
  async function handleCopyPeserta() {
    setCopying("peserta");
    try {
      const { pesertaList, summary } = await getData();
      const ok = await copyToClipboard(buildFormatPeserta(pesertaList, summary));
      toast.success(ok ? "Format peserta disalin" : "Gagal menyalin format");
    } catch {
      toast.error("Gagal menyalin format peserta");
    } finally {
      setCopying(null);
    }
  }

  // Menyalin format konsumsi (porsi makan per kelompok) ke clipboard
  async function handleCopyKonsumsi() {
    setCopying("konsumsi");
    try {
      const { summary } = await getData();
      const ok = await copyToClipboard(buildFormatKonsumsi(summary));
      toast.success(ok ? "Format konsumsi disalin" : "Gagal menyalin format");
    } catch {
      toast.error("Gagal menyalin format konsumsi");
    } finally {
      setCopying(null);
    }
  }

  const busy = exporting || copying !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={busy} className="gap-2">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Ekspor / Salin
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExport} disabled={busy}>
          <Download className="h-4 w-4" />
          Ekspor CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyPeserta} disabled={busy}>
          <ClipboardCopy className="h-4 w-4" />
          Copy Format Peserta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyKonsumsi} disabled={busy}>
          <UtensilsCrossed className="h-4 w-4" />
          Copy Format Konsumsi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}