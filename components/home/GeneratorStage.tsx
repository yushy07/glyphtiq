"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
import type { ConvertedResult } from "@/lib/text-engine/types";
import type { CompatibilityResult } from "@/lib/text-engine/compat";
import { STYLE_COUNT_LABEL } from "@/lib/text-engine/engine";
import { GeneratorInput } from "@/components/generator/GeneratorInput";
import { StyleGrid } from "@/components/generator/StyleGrid";
import type { PreviewSize } from "@/components/generator/StyleCard";
import { StageDivider } from "./StageDivider";

export interface GeneratorStageProps {
  text: string;
  maxLength: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onPaste: () => void;
  onSurprise: () => void;
  onCopyBest: () => void;
  onClear: () => void;
  bestResults: ConvertedResult[];
  previewSize: PreviewSize;
  favorites: string[];
  comparedIds: string[];
  trendingIds: string[];
  surpriseId: string | null;
  spotlightId: string | null;
  compatById?: Record<string, CompatibilityResult>;
  variantsByCanonical?: Record<string, ConvertedResult[]>;
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
}

/** Stage 1: type, convert and copy the best-of-the-pool styles. */
export const GeneratorStage = memo(function GeneratorStage({
  text,
  maxLength,
  textareaRef,
  onChange,
  onPaste,
  onSurprise,
  onCopyBest,
  onClear,
  bestResults,
  previewSize,
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
}: GeneratorStageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <section aria-label="Hero" className="flex flex-col items-center gap-4 pt-8 pb-6 text-center sm:pt-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface/70 px-3.5 py-1 text-[11px] font-bold tracking-widest text-primary uppercase backdrop-blur-sm shadow-sm">
          <Sparkles className="size-3" aria-hidden />
          Glyphtiq · Fancy text, locally
        </span>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-6xl">
          Make your words <span className="gradient-text">flow</span>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
          Turn plain text into {STYLE_COUNT_LABEL} unicode styles — bold, cursive, gothic,
          bubble and more. Everything converts right in your browser.
        </p>
      </section>

      <div data-generator className="w-full rounded-[24px] border border-border glass p-5 sm:p-7">
        <GeneratorInput
          value={text}
          maxLength={maxLength}
          onChange={onChange}
          onSurprise={onSurprise}
          onClear={onClear}
          onPaste={onPaste}
          onCopyBest={onCopyBest}
          textareaRef={textareaRef}
        />
      </div>

      <div id="best-styles" className="scroll-mt-16">
        <StageDivider
          emoji="✨"
          title="Best styles"
          subtitle="The most-loved picks — start typing to convert your own words, then copy one."
        />
        <StyleGrid
          results={bestResults}
          inputText={text}
          previewSize={previewSize}
          favorites={favorites}
          comparedIds={comparedIds}
          trendingIds={trendingIds}
          surpriseId={surpriseId}
          spotlightId={spotlightId}
          compatById={compatById}
          variantsByCanonical={variantsByCanonical}
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onToggleCompare={onToggleCompare}
          onShare={onShare}
        />
      </div>
    </div>
  );
});
