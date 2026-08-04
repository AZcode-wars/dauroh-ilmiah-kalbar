import type { NextConfig } from "next";

type SupabaseStoragePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseStoragePattern: SupabaseStoragePattern | undefined = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl);
      return {
        protocol: url.protocol === "https:" ? "https" : "http",
        hostname: url.hostname,
        pathname: "/storage/v1/object/public/about-images/**",
      };
    })()
  : undefined;

const nextConfig: NextConfig = {
  images: supabaseStoragePattern ? { remotePatterns: [supabaseStoragePattern] } : undefined,
};

export default nextConfig;
