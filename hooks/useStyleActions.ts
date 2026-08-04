"use client";

import { useCallback, useEffect } from "react";
import type { ConvertedResult } from "@/lib/text-engine/types";
import { getStyleById } from "@/lib/text-engine/styles";
import { track } from "@/lib/analytics";
import { isStringArray } from "@/lib/validation";
import { useClipboard } from "./useClipboard";
import { useFavorites } from "./useFavorites";
import { useRecentStyles } from "./useRecentStyles";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/Toast";

export interface StyleActionsOptions {
  /** Set on app pages to build share links and scoped analytics. */
  appSlug?: string;
  /** Display name for the share payload. */
  appName?: string;
  /** The current input text — drives what gets copied and shared. */
  inputText: string;
}

/**
 * The one set of copy / share / favorite / compare actions shared by the
 * homepage experience and every app page. Keeps analytics, toasts, recent
 * tracking and the comparison tray consistent everywhere.
 */
export function useStyleActions({ appSlug, appName, inputText }: StyleActionsOptions) {
  const { push } = useToast();
  const { copy } = useClipboard();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recent, record } = useRecentStyles();
  const [comparison, setComparison] = useLocalStorage<string[]>(
    "glyphtiq:comparison",
    [],
    isStringArray,
  );

  // Drop ids that no longer exist in the style library so storage never grows stale.
  useEffect(() => {
    setComparison((current) => {
      const valid = current.filter((id) => getStyleById(id) !== undefined);
      return valid.length === current.length ? current : valid;
    });
  }, [comparison, setComparison]);

  const copyStyle = useCallback(
    async (result: ConvertedResult) => {
      const copyText = inputText.trim() ? result.text : result.style.convert("Glyphtiq");
      const ok = await copy(copyText);
      if (!ok) return push("Could not copy", "error");
      record(result.style.id);
      track("copy", result.style.id, undefined, appSlug);
      push(`Copied ${result.style.name}`, "copy");
    },
    [copy, record, push, inputText, appSlug],
  );

  const shareStyle = useCallback(
    async (result: ConvertedResult) => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const path = appSlug ? `/${appSlug}/` : "/";
      const url = `${siteUrl}${path}?text=${encodeURIComponent(inputText)}&style=${result.style.id}`;
      track("share", result.style.id, undefined, appSlug);
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: appName ? `${appName} font — ${result.style.name}` : `Glyphtiq — ${result.style.name}`,
            text: result.text,
            url,
          });
          push("Shared", "share");
          return;
        } catch {
          // User cancelled — fall through to short-link copy.
        }
      }
      try {
        const res = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText, styleId: result.style.id, appSlug }),
        });
        if (!res.ok) throw new Error("share failed");
        const data = (await res.json()) as { id: string };
        const link = `${siteUrl}/s/${data.id}`;
        const ok = await copy(link);
        if (!ok) throw new Error("copy failed");
        push("Share link copied to clipboard", "share");
      } catch {
        push("Could not create a share link", "error");
      }
    },
    [inputText, copy, push, appSlug, appName],
  );

  const toggleFavoriteStyle = useCallback(
    (result: ConvertedResult) => {
      const wasFavorite = isFavorite(result.style.id);
      toggleFavorite(result.style.id);
      track("favorite", result.style.id, undefined, appSlug);
      push(wasFavorite ? "Removed from favorites" : "Added to favorites", "info");
    },
    [isFavorite, toggleFavorite, push, appSlug],
  );

  const toggleCompareStyle = useCallback(
    (result: ConvertedResult) => {
      const isAdding = !comparison.includes(result.style.id);
      setComparison((current) => {
        if (current.includes(result.style.id)) {
          return current.filter((id) => id !== result.style.id);
        }
        if (current.length >= 4) {
          const evictIndex = current.findIndex((id) => getStyleById(id) !== undefined);
          const toEvict = evictIndex === -1 ? current[0] : current[evictIndex];
          return [...current.filter((id) => id !== toEvict), result.style.id];
        }
        return [...current, result.style.id];
      });
      if (isAdding) track("compare", result.style.id, undefined, appSlug);
    },
    [comparison, setComparison, appSlug],
  );

  const removeFromComparison = useCallback(
    (id: string) => setComparison((current) => current.filter((c) => c !== id)),
    [setComparison],
  );

  const clearComparison = useCallback(() => setComparison([]), [setComparison]);

  return {
    push,
    copy: copyStyle,
    share: shareStyle,
    toggleFavorite: toggleFavoriteStyle,
    toggleCompare: toggleCompareStyle,
    favorites,
    isFavorite,
    recent,
    record,
    comparison,
    removeFromComparison,
    clearComparison,
  };
}
