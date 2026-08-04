"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Plus, Share2, Star } from "lucide-react";
import type { CompatibilityLevel, CompatibilityResult } from "@/lib/text-engine/compat";
import { resolveStyleMetadata } from "@/lib/text-engine/quality";
import { getAppByKey } from "@/lib/text-engine/apps";
import type { ConvertedResult } from "@/lib/text-engine/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PreviewSize = "sm" | "md" | "lg";

const PREVIEW_SIZE_CLASS: Record<PreviewSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const COMPAT_STYLES: Record<CompatibilityLevel, string> = {
  recommended: "border-success/30 bg-success/10 text-success",
  good: "border-primary/30 bg-primary/10 text-primary",
  uncertain: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  risky: "border-red-400/30 bg-red-400/10 text-red-400",
  tooLong: "border-amber-400/40 bg-amber-400/15 text-amber-300",
};

interface StyleCardProps {
  result: ConvertedResult;
  inputText: string;
  previewSize: PreviewSize;
  isFavorite: boolean;
  isCompared: boolean;
  isTrending?: boolean;
  highlighted?: boolean;
  /** One-shot glow used by Discovery picks (cleared by the coordinator). */
  spotlight?: boolean;
  compat?: CompatibilityResult;
  variants?: ConvertedResult[];
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
  onCardClick?: () => void;
}

function CopyButton({ result, onCopy, className }: { result: ConvertedResult; onCopy: (result: ConvertedResult) => void; className?: string }) {
  const [justCopied, setJustCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function handle() {
    onCopy(result);
    setJustCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setJustCopied(false), 1500);
  }

  const isInline = className !== undefined;
  return (
    <Button
      size={isInline ? "sm" : "sm"}
      variant={isInline ? "outline" : "primary"}
      onClick={handle}
      className={cn(isInline ? "shrink-0 px-2.5 text-xs" : "w-full")}
    >
      {justCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {justCopied ? "Copied" : "Copy"}
    </Button>
  );
}

/** Compact, preview-dominant card: name + preview + Copy are always visible.
 *  Everything else — favorite/share/compare, popularity, platforms, similar
 *  styles — is revealed on hover (desktop) or always visible on touch. */
export function StyleCard({
  result,
  inputText,
  previewSize,
  isFavorite,
  isCompared,
  isTrending,
  highlighted,
  spotlight,
  compat,
  variants = [],
  onCopy,
  onToggleFavorite,
  onToggleCompare,
  onShare,
  onCardClick,
}: StyleCardProps) {
  const [showSimilar, setShowSimilar] = useState(false);
  const { style, text } = result;
  const meta = resolveStyleMetadata(style);

  const preview = inputText ? text : style.convert("Glyphtiq");

  const platforms = meta.recommendedPlatforms
    .map((p) => getAppByKey(p)?.name)
    .filter((n): n is string => !!n)
    .slice(0, 3);

  function handleCopy() {
    onCopy(result);
    onCardClick?.();
  }

  return (
    <motion.article
      layout
      id={`style-${style.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("a")) return;
        handleCopy();
      }}
      className={cn(
        "group flex cursor-pointer flex-col rounded-2xl border glass p-3.5 shadow-sm transition-all hover:shadow-md",
        highlighted ? "border-primary ring-2 ring-primary/50" : "border-border hover:border-primary/40",
        spotlight && "spotlight-glow",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-sm font-bold text-foreground">{style.name}</h3>
        <div className="flex shrink-0 items-center gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(result)}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Star className={cn("size-4", isFavorite && "fill-amber-400 text-amber-400")} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Share ${style.name}`}
            onClick={() => onShare(result)}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Share2 className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={isCompared ? `Remove ${style.name} from comparison` : `Add ${style.name} to comparison`}
            aria-pressed={isCompared}
            onClick={() => onToggleCompare(result)}
            className={cn(
              "grid size-8 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isCompared ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {isCompared ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-1.5 line-clamp-3 rounded-lg bg-surface-2 p-3 leading-relaxed break-words text-foreground",
          PREVIEW_SIZE_CLASS[previewSize],
        )}
      >
        {preview}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-0 sm:max-h-0 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:mt-2 sm:group-hover:max-h-12 sm:group-hover:opacity-100">
        <span className="text-[11px] font-semibold text-muted">🔥 {meta.popularity} popularity</span>
        {platforms.length > 0 && (
          <span className="text-[11px] font-semibold text-muted">Works on {platforms.join(", ")}</span>
        )}
        {isTrending && (
          <span className="rounded-full bg-secondary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-secondary uppercase">
            🔥 Trending
          </span>
        )}
        {compat && (
          <span
            className={cn(
              "rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
              COMPAT_STYLES[compat.level],
            )}
            title={`Compatibility score ${compat.score}/100`}
          >
            {compat.label}
          </span>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            aria-expanded={showSimilar}
            onClick={() => setShowSimilar((open) => !open)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-surface-2/40 px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {showSimilar ? "Hide similar styles" : "Similar styles →"}
            <span className="rounded-full bg-surface-2 px-1.5 text-[10px] font-semibold text-muted">{variants.length}</span>
          </button>
          <AnimatePresence initial={false}>
            {showSimilar && (
              <motion.div
                key="similar"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="overflow-hidden"
              >
                <ul className="mt-2 space-y-2">
                  {variants.map((variant) => (
                    <li key={variant.style.id} className="rounded-xl border border-border/60 bg-surface-2/40 p-2.5">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">{variant.style.name}</span>
                        <CopyButton result={variant} onCopy={onCopy} />
                      </div>
                      <p className="truncate text-xs text-muted">{inputText ? variant.text : variant.style.convert("Glyphtiq")}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-2">
        <CopyButton result={result} onCopy={handleCopy} />
      </div>
    </motion.article>
  );
}
