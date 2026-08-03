"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Copy, Check, Download, Plus, Share2, Star } from "lucide-react";
import type { CompatibilityLevel, CompatibilityResult } from "@/lib/text-engine/compat";
import type { ConvertedResult } from "@/lib/text-engine/types";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PreviewSize = "sm" | "md" | "lg";

const PREVIEW_SIZE_CLASS: Record<PreviewSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
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
  compat?: CompatibilityResult;
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
  onCardClick?: () => void;
}

export function StyleCard({
  result,
  inputText,
  previewSize,
  isFavorite,
  isCompared,
  isTrending,
  highlighted,
  compat,
  onCopy,
  onToggleFavorite,
  onToggleCompare,
  onShare,
  onCardClick,
}: StyleCardProps) {
  const { push } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const { style, text } = result;

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const preview = inputText ? text : style.convert("Glyphy");

  async function handleDownload() {
    const node = exportRef.current;
    if (!node || downloading) return;
    setDownloading(true);
    try {
      const bg = getComputedStyle(node).backgroundColor || "#18181b";
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: bg,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `glyphy-${style.id}.png`;
      link.href = dataUrl;
      link.click();
      push("PNG saved to downloads", "download");
    } catch {
      push("Could not export this style", "error");
    } finally {
      setDownloading(false);
    }
  }

  function handleCopy() {
    onCopy(result);
    onCardClick?.();
    setJustCopied(true);
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => setJustCopied(false), 1500);
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
        "group flex flex-col cursor-pointer rounded-2xl border glass p-5 shadow-sm transition-shadow hover:shadow-md",
        highlighted
          ? "border-primary ring-2 ring-primary/50"
          : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-sm leading-snug font-bold text-foreground">
            {style.name}
          </h3>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
            {style.category}
          </span>
          {isTrending && (
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-secondary uppercase">
              🔥 Trending
            </span>
          )}
          {compat && (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                COMPAT_STYLES[compat.level],
              )}
              title={`Compatibility score ${compat.score}/100`}
            >
              {compat.label}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(result)}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Star
              className={cn(
                "size-4",
                isFavorite && "fill-amber-400 text-amber-400",
              )}
              aria-hidden
            />
          </button>
          <button
            type="button"
            aria-label={`Download ${style.name} as PNG`}
            onClick={handleDownload}
            disabled={downloading}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Share ${style.name}`}
            onClick={() => onShare(result)}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Share2 className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={isCompared ? `Remove ${style.name} from comparison` : `Add ${style.name} to comparison`}
            aria-pressed={isCompared}
            onClick={() => onToggleCompare(result)}
            className={cn(
              "grid size-9 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isCompared
                ? "bg-primary/15 text-primary"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {isCompared ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Plus className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        ref={exportRef}
        className={cn(
          "mt-3 max-h-36 min-h-12 overflow-y-auto rounded-xl bg-surface-2 p-3",
          PREVIEW_SIZE_CLASS[previewSize],
        )}
      >
        <p className="break-words leading-relaxed whitespace-pre-wrap text-foreground">
          {preview}
        </p>
      </div>

      <div className="mt-3">
        <Button size="sm" variant="primary" onClick={handleCopy} className="w-full">
          {justCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {justCopied ? "Copied" : "Copy"}
        </Button>
      </div>
    </motion.article>
  );
}
