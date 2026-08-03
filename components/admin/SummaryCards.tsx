"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BedDouble,
  Bike,
  Car,
  Bus,
  UtensilsCrossed,
  Info,
  ClipboardCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CARD_DEFS = [
  { key: "total_headcount", label: "Total Peserta", icon: Users },
  { key: "total_hadir", label: "Hadir", icon: ClipboardCheck },
  { key: "total_menginap", label: "Menginap", icon: BedDouble },
  { key: "total_motor", label: "Motor", icon: Bike },
  { key: "total_mobil", label: "Mobil", icon: Car },
  { key: "total_angkotan_umum", label: "Angkutan Umum", icon: Bus },
  { key: "total_paket_makan", label: "Paket Makan", icon: UtensilsCrossed },
];

type Summary = Record<string, number>;

function AnimatedValue({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

	useEffect(() => {
		const startTime = performance.now();
		let rafId: number;

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setDisplay(Math.floor(value * eased));
			if (progress < 1) { rafId = requestAnimationFrame(animate); }
		}

		rafId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafId);
	}, [value, duration]);

  return <>{display}</>;
}

export default function SummaryCards() {
  const [summary, setSummary] = useState<Summary | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/peserta/summary");
      if (res.ok) {
        setSummary((await res.json()) as Summary);
      }
    } catch {
      // Silent
    }
  }

  useEffect(() => {
    window.addEventListener("kehadiran-updated", load);
    Promise.resolve().then(() => { void load(); });
    return () => window.removeEventListener("kehadiran-updated", load);
  }, []);

  if (!summary) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CARD_DEFS.map((def) => (
          <div
            key={def.key}
            className="animate-pulse rounded-lg border border-[#e2e8f0] bg-white p-4"
          >
            <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
            <div className="h-7 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {CARD_DEFS.map((def, index) => {
        const Icon = def.icon;
        const val = summary[def.key] ?? 0;
        const isPaketMakan = def.key === "total_paket_makan";

        return (
          <div
            key={def.key}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-lg border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
          >
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
              <Icon className="h-3.5 w-3.5 text-emerald" />
              {def.label}
              {isPaketMakan && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="ml-auto rounded-full p-0.5 text-[#64748b] hover:text-emerald hover:bg-emerald/5 transition-colors">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-emerald">Rincian Paket Makan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center justify-between rounded-lg bg-emerald/5 px-4 py-3">
                        <span className="font-semibold">Total Paket Makan</span>
                        <span className="font-serif text-xl font-bold text-emerald">{val}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gold/10 px-4 py-3">
                        <span className="font-semibold">Makan per hari</span>
                        <span className="font-serif text-xl font-bold text-brown">3 kali</span>
                      </div>
                      <div className="border-t border-[#e2e8f0] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                            Paket per orang
                          </span>
                          <span className="font-serif text-2xl font-bold text-emerald">
                            {Math.floor(val / 3)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {val} ÷ 3 = {Math.floor(val / 3)} orang mendapat 3 kali makan sehari
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="font-serif text-2xl font-bold text-emerald">
              <AnimatedValue value={val} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
