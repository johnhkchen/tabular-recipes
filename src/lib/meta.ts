/* Small shared readers for the comma-separated metadata lines. */

/** `>> tags: a, b , ,c` becomes ['a','b','c']. Order and case are kept. */
export function splitList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

/** The URL form of a name: "Taquería" becomes "taqueria", "Pastry Case" becomes "pastry-case". */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // drop the accents NFD just split off
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
