"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { isStringArray } from "@/lib/validation";

const KEY = "glyphy:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(KEY, [], isStringArray);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev],
      );
    },
    [setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
