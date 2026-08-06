"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KABUPATEN_KALBAR, JENIS_KENDARAAN } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// Nilai-nilai filter yang dikirim ke parent component
export type FilterValues = {
  search: string;
  asal: string;
  menginap: string;
  kendaraan: string;
  rombongan: string;
};

type FilterBarProps = {
  onFilter: (filters: FilterValues) => void;
};

// Filter dan pencarian data peserta dengan dropdown dan input teks
export default function FilterBar({ onFilter }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [asal, setAsal] = useState("");
  const [menginap, setMenginap] = useState("");
  const [kendaraan, setKendaraan] = useState("");
  const [rombongan, setRombongan] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilters() {
    const next = !showFilters;
    setShowFilters(next);
  }

  function applyFilters() {
    onFilter({ search, asal, menginap, kendaraan, rombongan });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") applyFilters();
  }

  return (
    <div className="space-y-3">
      {/* Baris Pencarian */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau nomor WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          aria-label="Toggle filter"
          className={
            showFilters
              ? "bg-emerald text-white hover:bg-emerald/85 hover:text-white"
              : "hover:bg-slate-100 hover:text-slate-900"
          }
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        <Button
          onClick={applyFilters}
          className="bg-emerald hover:bg-emerald/85"
        >
          Cari
        </Button>

        {showFilters && (asal || menginap || kendaraan || rombongan) && (
          <Button
            variant="ghost"
            onClick={() => {
              setAsal("");
              setMenginap("");
              setKendaraan("");
              setRombongan("");
            }}
            className="text-xs text-muted-foreground hover:text-red-600"
          >
            Kosongkan Filter
          </Button>
        )}
      </div>

      {/* Panel Filter (toggled) */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-[#e2e8f0] bg-white p-4">
          <Select value={asal} onValueChange={setAsal}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Semua Asal" />
            </SelectTrigger>
            <SelectContent className="max-h-[13rem] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {KABUPATEN_KALBAR.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={menginap} onValueChange={setMenginap}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Menginap?" />
            </SelectTrigger>
            <SelectContent className="max-h-[13rem] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <SelectItem value="true">Ya</SelectItem>
              <SelectItem value="false">Tidak</SelectItem>
            </SelectContent>
          </Select>

          <Select value={kendaraan} onValueChange={setKendaraan}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Kendaraan" />
            </SelectTrigger>
            <SelectContent className="max-h-[13rem] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {JENIS_KENDARAAN.map((k) => (
                <SelectItem key={k.value} value={k.value}>
                  {k.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rombongan} onValueChange={setRombongan}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Rombongan?" />
            </SelectTrigger>
            <SelectContent className="max-h-[13rem] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <SelectItem value="true">Ya</SelectItem>
              <SelectItem value="false">Tidak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
