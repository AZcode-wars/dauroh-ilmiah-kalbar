// Pure function — bebas import server untuk digunakan di client component
export function getPesertaHeadcount(membawaRombongan: boolean, jumlahRombongan: number | null): number {
  return membawaRombongan ? 1 + (jumlahRombongan ?? 0) : 1;
}
