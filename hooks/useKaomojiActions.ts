"use client";

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { isStringArray } from "@/lib/validation";
import type { KaomojiEntry } from "@/lib/kaomoji/types";
import { useClipboard } from "./useClipboard";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/Toast";

const FAVORITES_KEY = "glyphtiq:kaomoji-favorites";
const RECENT_KEY = "glyphtiq:kaomoji-recent";
const MAX_RECENT = 100;

export interface RecentKaomoji {
  slug: string;
  at: number;
}

const isRecentArray = (value: unknown): value is RecentKaomoji[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { slug?: unknown }).slug === "string" &&
      typeof (entry as { at?: unknown }).at === "number",
  );

export function useKaomojiActions(appSlug = "kaomoji") {
  const { copy } = useClipboard();
  const { push } = useToast();
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    FAVORITES_KEY,
    [],
    isStringArray,
  );
  const [recent, setRecent] = useLocalStorage<RecentKaomoji[]>(
    RECENT_KEY,
    [],
    isRecentArray,
  );

  const copyKaomoji = useCallback(
    async (entry: KaomojiEntry) => {
      const ok = await copy(entry.expression);
      if (!ok) return push("Could not copy", "error");
      setRecent((prev) => {
        const rest = prev.filter((r) => r.slug !== entry.slug);
        return [{ slug: entry.slug, at: Date.now() }, ...rest].slice(0, MAX_RECENT);
      });
      track("copy", `kaomoji:${entry.slug}`, undefined, appSlug);
      push(`Copied ${entry.expression}`, "copy");
    },
    [appSlug, copy, push, setRecent],
  );

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback(
    (slug: string) => {
      setFavorites((prev) =>
        prev.includes(slug) ? prev.filter((f) => f !== slug) : [slug, ...prev],
      );
      track("favorite", `kaomoji:${slug}`, undefined, appSlug);
    },
    [appSlug, setFavorites],
  );

  const exportFavorites = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `glyphtiq-kaomoji-favorites-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    push(`Exported ${favorites.length} kaomoji favorites`, "copy");
  }, [favorites, push]);

  const importFavorites = useCallback((slugs: string[]) => {
    if (!Array.isArray(slugs)) {
      push("Invalid file format", "error");
      return;
    }
    const validSlugs = slugs.filter((s) => typeof s === "string" && s.length > 0);
    setFavorites((prev) => Array.from(new Set([...prev, ...validSlugs])));
    push(`Imported ${validSlugs.length} kaomojis`, "copy");
  }, [push, setFavorites]);

  return {
    copyKaomoji,
    favorites,
    isFavorite,
    toggleFavorite,
    exportFavorites,
    importFavorites,
    recent,
  };
}
