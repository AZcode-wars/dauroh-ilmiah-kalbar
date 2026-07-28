import { formatInTimeZone } from "date-fns-tz";
import type { Settings } from "@/types/settings";

// Fungsi pembantu untuk memformat ISO timestamp dari database menjadi format string khusus WIB
export function formatToWIB(isoString: string | null): string {
  if (!isoString) return "-";
  return formatInTimeZone(new Date(isoString), "Asia/Jakarta", "dd MMM yyyy, HH:mm 'WIB'");
}

// Fungsi pembantu untuk menentukan apakah saat ini masih dalam periode pendaftaran yang ditentukan
export function isWithinRegistrationWindow(
  settings: Pick<Settings, "registration_open_at" | "registration_close_at">, 
  now = new Date()
): boolean {
  return now >= new Date(settings.registration_open_at) && now <= new Date(settings.registration_close_at);
}
