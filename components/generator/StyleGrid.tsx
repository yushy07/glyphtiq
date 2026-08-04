"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SearchX, Sparkles } from "lucide-react";
import type { CompatibilityResult } from "@/lib/text-engine/compat";
import type { ConvertedResult } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import { StyleCard, type PreviewSize } from "./StyleCard";

export type GridDensity = "cozy" | "compact";

interface StyleGridProps {
  results: ConvertedResult[];
  inputText: string;
  previewSize: PreviewSize;
  density?: GridDensity;
  favorites: string[];
  comparedIds: string[];
  trendingIds: string[];
  surpriseId: string | null;
  spotlightId?: string | null;
  compatById?: Record<string, CompatibilityResult>;
  variantsByCanonical?: Record<string, ConvertedResult[]>;
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
  onCardClick?: () => void;
}

export function StyleGrid({
  results,
  inputText,
  previewSize,
  density = "cozy",
  favorites,
  comparedIds,
  trendingIds,
  surpriseId,
  spotlightId,
  compatById,
  variantsByCanonical,
  onCopy,
  onToggleFavorite,
  onToggleCompare,
  onShare,
  onCardClick,
}: StyleGridProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border glass px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface-2">
          <SearchX className="size-6 text-muted" aria-hidden />
        </span>
        <p className="font-bold text-foreground">No styles found</p>
        <p className="max-w-xs text-sm text-muted">
          Try a different search term or category — or clear your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!inputText && (
        <p className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Sparkles className="size-4 text-primary" aria-hidden />
          Previewing sample text — start typing above to convert your own words.
        </p>
      )}
      <motion.div
        layout
        className={cn(
          "grid",
          density === "compact"
            ? "gap-3 sm:grid-cols-2 lg:grid-cols-4"
            : "gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        <AnimatePresence mode="popLayout">
          {results.map((result) => (
            <StyleCard
              key={result.style.id}
              result={result}
              inputText={inputText}
              previewSize={previewSize}
              isFavorite={favorites.includes(result.style.id)}
              isCompared={comparedIds.includes(result.style.id)}
              isTrending={trendingIds.includes(result.style.id)}
              highlighted={surpriseId === result.style.id}
              spotlight={spotlightId === result.style.id}
              compat={compatById?.[result.style.id]}
              variants={variantsByCanonical?.[result.style.id]}
              onCopy={onCopy}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
              onShare={onShare}
              onCardClick={onCardClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
