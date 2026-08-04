"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { KaomojiEntry } from "@/lib/kaomoji/types";
import { KaomojiCard } from "./KaomojiCard";

interface Props {
  entries: KaomojiEntry[];
  favorites: string[];
  copiedSlug: string | null;
  onCopy: (entry: KaomojiEntry) => void;
  onToggleFavorite: (slug: string) => void;
  onInfo: (entry: KaomojiEntry) => void;
}

const CARD_HEIGHT = 140;
const GAP = 12;
const MIN_COL_WIDTH = 160;

export function KaomojiGrid({
  entries,
  favorites,
  copiedSlug,
  onCopy,
  onToggleFavorite,
  onInfo,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const setParent = useCallback((el: HTMLDivElement | null) => {
    parentRef.current = el;
    observerRef.current?.disconnect();
    if (!el) return;
    observerRef.current = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect.width ?? 0);
    });
    observerRef.current.observe(el);
  }, []);

  const cols = width > 0
    ? Math.min(6, Math.max(2, Math.floor((width + GAP) / (MIN_COL_WIDTH + GAP))))
    : 4;
  const rows = Math.ceil(entries.length / cols);
  const rowSize = CARD_HEIGHT + GAP;

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowSize,
    overscan: 4,
  });

  return (
    <div
      ref={setParent}
      className="h-[calc(100vh-320px)] min-h-[440px] overflow-y-auto pr-1"
      role="list"
      aria-label="Kaomojis"
    >
      <div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * cols;
          const rowEntries = entries.slice(start, start + cols);
          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gap: `${GAP}px`,
                }}
              >
                {rowEntries.map((entry) => (
                  <KaomojiCard
                    key={entry.id}
                    entry={entry}
                    favorite={favorites.includes(entry.slug)}
                    copied={copiedSlug === entry.slug}
                    onCopy={() => onCopy(entry)}
                    onToggleFavorite={() => onToggleFavorite(entry.slug)}
                    onInfo={() => onInfo(entry)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
