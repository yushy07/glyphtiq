"use client";

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { isStringArray } from "@/lib/validation";
import type { UsernameResult } from "@/lib/usernames/types";
import { useClipboard } from "./useClipboard";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/Toast";

const FAVORITES_KEY = "glyphtiq:username-favorites";
const RECENT_KEY = "glyphtiq:username-recent";
const MAX_RECENT = 100;

export interface RecentUsername {
  username: string;
  at: number;
}

const isRecentArray = (val: unknown): val is RecentUsername[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RecentUsername).username === "string" &&
      typeof (item as RecentUsername).at === "number",
  );

export function useUsernameActions(appSlug = "username-generator") {
  const { copy } = useClipboard();
  const { push } = useToast();
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    FAVORITES_KEY,
    [],
    isStringArray,
  );
  const [recent, setRecent] = useLocalStorage<RecentUsername[]>(
    RECENT_KEY,
    [],
    isRecentArray,
  );

  const copyUsername = useCallback(
    async (item: UsernameResult) => {
      const ok = await copy(item.username);
      if (!ok) return push("Could not copy username", "error");
      setRecent((prev) => {
        const rest = prev.filter((r) => r.username !== item.username);
        return [{ username: item.username, at: Date.now() }, ...rest].slice(0, MAX_RECENT);
      });
      track("copy", `username:${item.username}`, undefined, appSlug);
      push(`Copied ${item.username}`, "copy");
    },
    [appSlug, copy, push, setRecent],
  );

  const isFavorite = useCallback(
    (username: string) => favorites.includes(username),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (username: string) => {
      setFavorites((prev) =>
        prev.includes(username) ? prev.filter((f) => f !== username) : [username, ...prev],
      );
      track("favorite", `username:${username}`, undefined, appSlug);
    },
    [appSlug, setFavorites],
  );

  const exportFavorites = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `glyphtiq-username-favorites-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    push(`Exported ${favorites.length} username favorites`, "copy");
  }, [favorites, push]);

  const importFavorites = useCallback((items: string[]) => {
    if (!Array.isArray(items)) return;
    const valid = items.filter((s) => typeof s === "string" && s.length > 0);
    setFavorites((prev) => Array.from(new Set([...prev, ...valid])));
    push(`Imported ${valid.length} usernames`, "copy");
  }, [push, setFavorites]);

  return {
    copyUsername,
    favorites,
    isFavorite,
    toggleFavorite,
    exportFavorites,
    importFavorites,
    recent,
  };
}
