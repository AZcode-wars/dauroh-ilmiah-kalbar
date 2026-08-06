// Pure function — bebas import server untuk digunakan di client component
// Headcount = 1 (pendaftar) + seluruh rincian rombongan.
// Asatidzah sudah termasuk dalam angka dewasa, jadi tidak ditambahkan lagi.
export function getPesertaHeadcount(
  rombonganIkhwanDewasa: number,
  rombonganIkhwanAnak: number,
  rombonganAkhwatDewasa: number,
  rombonganAkhwatAnak: number
): number {
  return 1 + rombonganIkhwanDewasa + rombonganIkhwanAnak + rombonganAkhwatDewasa + rombonganAkhwatAnak;
}
