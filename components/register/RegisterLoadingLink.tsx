"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { showRegisterLoadingToast } from "@/lib/register-loading";

interface RegisterLoadingLinkProps {
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

// Link ke halaman register yang memunculkan toast "Tunggu Sebentar..."
// selama navigasi sebelum halaman selesai dirender.
export function RegisterLoadingLink({
  href = "/register",
  className,
  children,
  onClick,
}: RegisterLoadingLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        showRegisterLoadingToast();
      }}
    >
      {children}
    </Link>
  );
}
