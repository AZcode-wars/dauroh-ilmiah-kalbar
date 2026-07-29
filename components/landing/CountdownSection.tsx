"use client";

import { useState, useEffect } from "react";

const target = new Date("2026-08-21T07:00:00+07:00").getTime();

function calc() {
  const now = Date.now();
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownSection() {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Hari", value: t.days },
    { label: "Jam", value: t.hours },
    { label: "Menit", value: t.minutes },
    { label: "Detik", value: t.seconds },
  ];

  return (
    <section className="py-10 md:py-14 px-4 bg-cream-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-brown font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-2">
          Menuju Hari H
        </p>
        <p className="text-emerald/50 font-sans text-xs mb-6">
          21–23 Agustus 2026
        </p>

        <div className="flex justify-center gap-3 md:gap-5">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-white rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-18 md:min-w-22 shadow-[0_4px_16px_rgba(0,53,39,0.06)]"
            >
              <span className="font-serif text-2xl md:text-3xl font-bold text-emerald leading-none">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-emerald/50 font-sans text-[10px] md:text-xs font-medium mt-1.5 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
