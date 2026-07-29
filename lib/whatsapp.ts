// Membangun URL WhatsApp dengan nomor dan pesan yang sudah diencode
export function buildWhatsAppUrl(nomorWa: string, message: string): string {
  const normalized = nomorWa.startsWith("08") ? `62${nomorWa.slice(1)}` : nomorWa;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
