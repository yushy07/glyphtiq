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
  isSelected?: boolean;
  isEditing?: boolean;
  compat?: CompatibilityResult;
  variants?: ConvertedResult[];
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
  onCardClick?: () => void;
  onSelectCard?: () => void;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
  onInputChange?: (value: string) => void;
}

function CopyButton({ result, onCopy, className }: { result: ConvertedResult; onCopy: (result: ConvertedResult) => void; className?: string }) {
  const [justCopied, setJustCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function handle(e: React.MouseEvent) {
    e.stopPropagation();
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

const TOUCH_MOVE_THRESHOLD = 8;

export function StyleCard({
  result,
  inputText,
  previewSize,
  isFavorite,
  isCompared,
  isTrending,
  highlighted,
  spotlight,
  isSelected = false,
  isEditing = false,
  compat,
  variants = [],
  onCopy,
  onToggleFavorite,
  onToggleCompare,
  onShare,
  onCardClick,
  onSelectCard,
  onStartEdit,
  onEndEdit,
  onInputChange,
}: StyleCardProps) {
  const [showSimilar, setShowSimilar] = useState(false);
  const { style, text } = result;
  const meta = resolveStyleMetadata(style);

  const preview = inputText ? text : style.convert("Glyphtiq");

  const platforms = meta.recommendedPlatforms
    .map((p) => getAppByKey(p)?.name)
    .filter((n): n is string => !!n)
    .slice(0, 3);

  const cardRef = useRef<HTMLElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isScrollRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [isSelected]);

  useEffect(() => {
    if (isEditing) {
      if (!inputText) {
        onInputChange?.("Glyphtiq");
      }
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) {
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      isScrollRef.current = false;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    if (touch) {
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      if (Math.hypot(dx, dy) > TOUCH_MOVE_THRESHOLD) {
        isScrollRef.current = true;
      }
    }
  }

  function handleTouchEnd() {
    touchStartPos.current = null;
  }

  function handleCopy() {
    onCopy(result);
    onCardClick?.();
  }

  function handleCardClick(e: React.MouseEvent) {
    if (isScrollRef.current) {
      isScrollRef.current = false;
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("textarea")) {
      return;
    }

    if (!isSelected || !isEditing) {
      onSelectCard?.();
      onStartEdit?.();
    }
  }

  function handlePreviewClick(e: React.MouseEvent) {
    if (isScrollRef.current) {
      isScrollRef.current = false;
      return;
    }
    e.stopPropagation();
    if (!isSelected || !isEditing) {
      onSelectCard?.();
      onStartEdit?.();
    }
  }

  return (
    <motion.article
      ref={cardRef}
      layout
      id={`style-${style.id}`}
      data-card-id={style.id}
      aria-selected={isSelected}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      className={cn(
        "group flex cursor-pointer flex-col rounded-2xl border glass p-3.5 shadow-sm transition-all hover:shadow-md",
        isEditing
          ? "border-primary ring-2 ring-primary shadow-lg bg-surface-2/30"
          : isSelected
          ? "border-primary ring-2 ring-primary/50 shadow-md"
          : highlighted
          ? "border-primary ring-2 ring-primary/50"
          : "border-border hover:border-primary/40",
        spotlight && "spotlight-glow",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <h3 className="truncate text-sm font-bold text-foreground">{style.name}</h3>
          {isSelected && !isEditing && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
              Selected
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(result);
            }}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Star className={cn("size-4", isFavorite && "fill-amber-400 text-amber-400")} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Share ${style.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onShare(result);
            }}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Share2 className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={isCompared ? `Remove ${style.name} from comparison` : `Add ${style.name} to comparison`}
            aria-pressed={isCompared}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(result);
            }}
            className={cn(
              "grid size-8 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isCompared ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {isCompared ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-1.5 flex flex-col gap-2 rounded-lg bg-surface-2 p-2.5 border border-primary/60 ring-1 ring-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
              Editing inline
            </span>
            <span className="text-[10px] text-muted font-medium">
              Enter to save · Esc to cancel
            </span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => onInputChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault();
                onEndEdit?.();
              }
            }}
            aria-label="Edit preview text"
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div
            className={cn(
              "break-words text-foreground leading-[1.9] pt-1 border-t border-border/40",
              PREVIEW_SIZE_CLASS[previewSize],
            )}
          >
            {preview}
          </div>
        </div>
      ) : (
        <div
          onClick={handlePreviewClick}
          className={cn(
            "mt-1.5 min-h-[3.5rem] rounded-lg bg-surface-2 px-3 py-3.5 break-words text-foreground transition-colors",
            isSelected ? "border border-primary/30 hover:border-primary/60 hover:bg-surface-2/80" : "",
            "leading-[1.9]",
            PREVIEW_SIZE_CLASS[previewSize],
          )}
          title="Click card to edit text"
        >
          {preview}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 min-h-[1.5rem] sm:mt-2">
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
            onClick={(e) => {
              e.stopPropagation();
              setShowSimilar((open) => !open);
            }}
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
                      <p className="break-words text-xs leading-[1.8] text-muted">{inputText ? variant.text : variant.style.convert("Glyphtiq")}</p>
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

