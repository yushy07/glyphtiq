"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "glyphtiq:recent";

export interface RecentEntry {
  styleId: string;
  at: number;
}

const MAX = 5;

const isRecentEntryArray = (value: unknown): value is RecentEntry[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { styleId?: unknown }).styleId === "string" &&
      typeof (entry as { at?: unknown }).at === "number",
  );

export function useRecentStyles() {
  const [recent, setRecent] = useLocalStorage<RecentEntry[]>(KEY, [], isRecentEntryArray);

  const record = useCallback(
    (styleId: string) => {
      setRecent((prev) => {
        const rest = prev.filter((e) => e.styleId !== styleId);
        return [{ styleId, at: Date.now() }, ...rest].slice(0, MAX);
      });
    },
    [setRecent],
  );

  const clear = useCallback(() => setRecent([]), [setRecent]);

  return { recent, record, clear };
}
