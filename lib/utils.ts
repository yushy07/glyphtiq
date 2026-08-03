export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clampText(text: string, max: number): string {
  return Array.from(text).slice(0, max).join("");
}

export type PaginationItem = number | "ellipsis";

/**
 * Builds the list of pagination buttons to render. Always keeps the first and
 * last page plus a small window around `current`, inserting "ellipsis" for
 * gaps. Returns every page when the total is small.
 */
export function getPaginationItems(
  current: number,
  total: number,
): PaginationItem[] {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total]);
  for (const p of [current - 1, current, current + 1]) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  if (current <= 2) {
    pages.add(2);
    pages.add(3);
    pages.add(total - 1);
  }
  if (current >= total - 1) {
    pages.add(total - 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}
