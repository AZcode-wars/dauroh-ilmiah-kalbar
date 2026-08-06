"use client";

import { useEffect } from "react";
import { dismissRegisterLoadingToast } from "@/lib/register-loading";

// Hilangkan toast "Tunggu Sebentar..." begitu halaman register selesai dirender
export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    dismissRegisterLoadingToast();
  }, []);

  return <>{children}</>;
}
