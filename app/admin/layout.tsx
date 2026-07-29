import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAdminAuthenticated } from "@/lib/auth";

// Layout admin: verifikasi HMAC session untuk semua halaman kecuali login
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Baca pathname dari custom header yang di-set oleh middleware
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Jangan redirect jika sudah di halaman login (mencegah infinite loop)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
