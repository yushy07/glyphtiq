"use client";

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { isStringArray } from "@/lib/validation";
import type { SymbolEntry } from "@/lib/symbols/types";
import { useClipboard } from "./useClipboard";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/Toast";

const FAVORITES_KEY = "glyphtiq:symbol-favorites";
const RECENT_KEY = "glyphtiq:symbol-recent";
const MAX_RECENT = 100;

export interface RecentSymbol {
  slug: string;
  at: number;
}

const isRecentSymbolArray = (value: unknown): value is RecentSymbol[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { slug?: unknown }).slug === "string" &&
      typeof (entry as { at?: unknown }).at === "number",
  );

/**
 * Copy / favorite / recent orchestration for the symbol explorer. Favorites and
 * recents use their own localStorage keys so they never mix with text styles.
 * Analytics events are scoped with appSlug="symbols" and styleId="symbol:<slug>".
 */
export function useSymbolActions(appSlug = "symbols") {
  const { copy } = useClipboard();
  const { push } = useToast();
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    FAVORITES_KEY,
    [],
    isStringArray,
  );
  const [recent, setRecent] = useLocalStorage<RecentSymbol[]>(
    RECENT_KEY,
    [],
    isRecentSymbolArray,
  );

  const styleId = useCallback((slug: string) => `symbol:${slug}`, []);

  const copySymbol = useCallback(
    async (entry: SymbolEntry) => {
      const ok = await copy(entry.char);
      if (!ok) return push("Could not copy", "error");
      setRecent((prev) => {
        const rest = prev.filter((r) => r.slug !== entry.slug);
        return [{ slug: entry.slug, at: Date.now() }, ...rest].slice(0, MAX_RECENT);
      });
      track("copy", styleId(entry.slug), undefined, appSlug);
      push(`Copied ${entry.name}`, "copy");
    },
    [appSlug, copy, push, setRecent, styleId],
  );

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback(
    (slug: string) => {
      setFavorites((prev) =>
        prev.includes(slug) ? prev.filter((f) => f !== slug) : [slug, ...prev],
      );
      track("favorite", styleId(slug), undefined, appSlug);
    },
    [appSlug, setFavorites, styleId],
  );

  const clearRecent = useCallback(() => setRecent([]), [setRecent]);

  const exportFavorites = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `glyphtiq-symbol-favorites-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    push(`Exported ${favorites.length} favorites`, "copy");
  }, [favorites, push]);

  const importFavorites = useCallback((slugs: string[]) => {
    if (!Array.isArray(slugs)) {
      push("Invalid favorites import file", "error");
      return;
    }
    const validSlugs = slugs.filter((s) => typeof s === "string" && s.length > 0);
    setFavorites((prev) => Array.from(new Set([...prev, ...validSlugs])));
    push(`Imported ${validSlugs.length} favorites`, "copy");
  }, [push, setFavorites]);

  return {
    copySymbol,
    favorites,
    isFavorite,
    toggleFavorite,
    exportFavorites,
    importFavorites,
    recent,
    clearRecent,
  };
}
