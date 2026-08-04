"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { EntityType, FavoriteItem } from "./types";

const FAVORITES_STORAGE_KEY = "glyphtiq:unified-favorites";

const isFavoriteItemArray = (val: unknown): val is FavoriteItem[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as FavoriteItem).id === "string" &&
      typeof (item as FavoriteItem).type === "string" &&
      typeof (item as FavoriteItem).content === "string",
  );

export function useUnifiedFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>(
    FAVORITES_STORAGE_KEY,
    [],
    isFavoriteItemArray,
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, "addedAt">) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        if (exists) {
          return prev.filter((f) => f.id !== item.id);
        }
        return [{ ...item, addedAt: Date.now() }, ...prev];
      });
    },
    [setFavorites],
  );

  const getFavoritesByType = useCallback(
    (type: EntityType) => favorites.filter((item) => item.type === type),
    [favorites],
  );

  const exportFavorites = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `glyphtiq-favorites-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, [favorites]);

  const importFavorites = useCallback((items: FavoriteItem[]) => {
    if (!Array.isArray(items)) return;
    const valid = items.filter((i) => typeof i === "object" && i !== null && typeof i.id === "string");
    setFavorites((prev) => {
      const map = new Map(prev.map((f) => [f.id, f]));
      for (const item of valid) map.set(item.id, item);
      return Array.from(map.values());
    });
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    exportFavorites,
    importFavorites,
  };
}
