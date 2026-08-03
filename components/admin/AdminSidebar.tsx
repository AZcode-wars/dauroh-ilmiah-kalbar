"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Trash2,
  Settings,
  LogOut,
  LibraryBig,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Navigasi sidebar admin dengan indikator active state dan tombol logout
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/kehadiran", label: "Check-in", icon: ClipboardCheck },
  { href: "/admin/dashboard/trash", label: "Trash", icon: Trash2 },
  { href: "/admin/dashboard/settings", label: "Pengaturan", icon: Settings },
];

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full flex-col bg-emerald text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-soft/30 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/20">
            <LibraryBig className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold leading-tight">
              Dashboard Admin
            </h1>
            <p className="text-[11px]">Dauroh Ilmiah Kalbar</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white shadow-[inset_3px_0_0_#cca730]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-emerald-soft/30 px-3 py-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-white/70 hover:bg-red-400 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  );
}
