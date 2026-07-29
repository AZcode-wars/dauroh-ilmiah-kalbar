import AdminShell from "@/components/admin/AdminShell";

// Layout khusus dashboard: membungkus halaman dengan sidebar admin
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
