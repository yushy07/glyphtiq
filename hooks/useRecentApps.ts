"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "glyphtiq:recent-apps";

export interface RecentAppEntry {
  slug: string;
  at: number;
}

const MAX = 6;

const isRecentAppEntryArray = (value: unknown): value is RecentAppEntry[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { slug?: unknown }).slug === "string" &&
      typeof (entry as { at?: unknown }).at === "number",
  );

export function useRecentApps() {
  const [recent, setRecent] = useLocalStorage<RecentAppEntry[]>(KEY, [], isRecentAppEntryArray);

  const record = useCallback(
    (slug: string) => {
      setRecent((prev) => {
        const rest = prev.filter((e) => e.slug !== slug);
        return [{ slug, at: Date.now() }, ...rest].slice(0, MAX);
      });
    },
    [setRecent],
  );

  const clear = useCallback(() => setRecent([]), [setRecent]);

  return { recent, record, clear };
}
