import type { SymbolEntry } from "./types";

/** Sort keys for the /symbols explorer. */
export type SymbolSort = "recommended" | "name" | "code" | "newest";

/** Returns a new array sorted by the requested key (never mutates the source). */
export function sortSymbols(list: SymbolEntry[], sort: SymbolSort): SymbolEntry[] {
  switch (sort) {
    case "name":
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    case "code":
      return [...list].sort(
        (a, b) => parseInt(a.codePoint, 16) - parseInt(b.codePoint, 16),
      );
    case "newest":
      return [...list].sort(
        (a, b) =>
          Number(b.unicodeVersion) - Number(a.unicodeVersion) ||
          parseInt(a.codePoint, 16) - parseInt(b.codePoint, 16),
      );
    case "recommended":
      return [...list].sort(
        (a, b) => b.popularity - a.popularity || parseInt(a.codePoint, 16) - parseInt(b.codePoint, 16),
      );
  }
}
