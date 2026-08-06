"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Shell layout admin: sidebar tetap di desktop, drawer di mobile
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#fdfbf7] overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-[260px] lg:flex-col lg:shrink-0">
        <div className="flex h-full flex-col">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </div>

        {/* Konten Utama */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Bar Mobile */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e2e8f0] bg-white px-4 lg:hidden shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-emerald hover:bg-emerald/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-sm font-bold text-emerald leading-tight">
              Dauroh
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Manis Raya
            </p>
          </div>
        </header>

        <main className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
