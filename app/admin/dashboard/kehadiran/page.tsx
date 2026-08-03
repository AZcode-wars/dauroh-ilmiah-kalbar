"use client";

import CheckInDesk from "@/components/admin/CheckInDesk";

// Halaman check-in hari-H: layar khusus petugas untuk registrasi ulang peserta
export default function KehadiranPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col gap-6 animate-in fade-in duration-500">
      <CheckInDesk />
    </div>
  );
}
