export function formatNomorWaForCsv(nomorWa: string): string {
  return `="${nomorWa}"`;
}

// Melakukan escaping sel CSV sampai aman; jika mengandung koma/kutip/baris baru,
// bungkus kutip ganda dan gandakan kutip di dalamnya.
export function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
