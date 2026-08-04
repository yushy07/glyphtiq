/**
 * Slug helpers for symbol URLs. The committed dataset already resolves slug
 * collisions (duplicate names get a "-u<hex>" suffix), this module exposes the
 * same normalization so lookups stay in sync.
 */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
