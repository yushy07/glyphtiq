"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { SymbolEntry } from "@/lib/symbols/types";
import { SymbolCard } from "./SymbolCard";

export type DensityMode = "compact" | "comfortable" | "large";

interface SymbolGridProps {
  entries: SymbolEntry[];
  favorites: string[];
  copiedSlug: string | null;
  onCopy: (entry: SymbolEntry) => void;
  onToggleFavorite: (slug: string) => void;
  onInfo: (entry: SymbolEntry) => void;
  density?: DensityMode;
  onDensityChange?: (mode: DensityMode) => void;
}

export function SymbolGrid({
  entries,
  favorites,
  copiedSlug,
  onCopy,
  onToggleFavorite,
  onInfo,
  density = "comfortable",
  onDensityChange,
}: SymbolGridProps) {
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

  const minColWidth = density === "compact" ? 80 : density === "large" ? 140 : 108;
  const cardHeight = density === "compact" ? 90 : density === "large" ? 140 : 112;
  const gap = 12;

  const cols = width > 0
    ? Math.min(10, Math.max(2, Math.floor((width + gap) / (minColWidth + gap))))
    : 4;
  const rows = Math.ceil(entries.length / cols);
  const rowSize = cardHeight + gap;

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual returns non-memoizable functions by design; re-renders on demand.
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowSize,
    overscan: 5,
  });

  return (
    <div>
      {onDensityChange && (
        <div className="mb-3 flex items-center justify-end gap-1.5 text-xs text-muted">
          <span className="font-semibold">Grid View:</span>
          <button
            type="button"
            onClick={() => onDensityChange("compact")}
            className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
              density === "compact" ? "bg-primary text-primary-foreground" : "border border-border glass"
            }`}
          >
            Compact
          </button>
          <button
            type="button"
            onClick={() => onDensityChange("comfortable")}
            className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
              density === "comfortable" ? "bg-primary text-primary-foreground" : "border border-border glass"
            }`}
          >
            Comfortable
          </button>
          <button
            type="button"
            onClick={() => onDensityChange("large")}
            className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
              density === "large" ? "bg-primary text-primary-foreground" : "border border-border glass"
            }`}
          >
            Large
          </button>
        </div>
      )}

      <div
        ref={setParent}
        className="h-[calc(100vh-320px)] min-h-[420px] overflow-y-auto pr-1"
        role="list"
        aria-label="Symbols"
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
                    gap: `${gap}px`,
                  }}
                >
                  {rowEntries.map((entry) => (
                    <SymbolCard
                      key={entry.slug}
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
    </div>
  );
}
