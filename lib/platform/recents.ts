"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ActivityAction, EntityType, RecentActivityItem } from "./types";

const ACTIVITY_STORAGE_KEY = "glyphtiq:unified-activity";
const MAX_LOG_SIZE = 100;

const isActivityItemArray = (val: unknown): val is RecentActivityItem[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RecentActivityItem).id === "string" &&
      typeof (item as RecentActivityItem).action === "string",
  );

export function useUnifiedActivity() {
  const [activityLog, setActivityLog] = useLocalStorage<RecentActivityItem[]>(
    ACTIVITY_STORAGE_KEY,
    [],
    isActivityItemArray,
  );

  const logActivity = useCallback(
    (item: { id: string; type: EntityType; action: ActivityAction; title: string; content: string; slug?: string }) => {
      setActivityLog((prev) => {
        const filtered = prev.filter((a) => !(a.id === item.id && a.action === item.action));
        const newItem: RecentActivityItem = {
          ...item,
          timestamp: Date.now(),
        };
        return [newItem, ...filtered].slice(0, MAX_LOG_SIZE);
      });
    },
    [setActivityLog],
  );

  const clearActivity = useCallback(() => setActivityLog([]), [setActivityLog]);

  return {
    activityLog,
    logActivity,
    clearActivity,
  };
}
