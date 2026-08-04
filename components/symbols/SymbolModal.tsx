"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Heart, X } from "lucide-react";
import { getBlock } from "@/lib/symbols/blocks";
import { getCategory } from "@/lib/symbols/categories";
import { toHtmlEntity, toUnicodeEscape } from "@/lib/symbols/encoding";
import type { SymbolEntry } from "@/lib/symbols/types";
import { cn } from "@/lib/utils";

interface SymbolModalProps {
  entry: SymbolEntry | null;
  favorite: boolean;
  onClose: () => void;
  onCopy: (entry: SymbolEntry) => void;
  onToggleFavorite: (slug: string) => void;
}

export function SymbolModal({
  entry,
  favorite,
  onClose,
  onCopy,
  onToggleFavorite,
}: SymbolModalProps) {
  useEffect(() => {
    if (!entry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onClose is stable per entry open
  }, [entry]);

  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.button
            type="button"
            aria-label="Close symbol details"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${entry.name} details`}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className="grid size-20 shrink-0 place-items-center rounded-2xl border border-border bg-surface-2 text-5xl text-foreground"
                aria-hidden
              >
                {entry.char}
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <h2 className="text-lg leading-snug font-extrabold tracking-tight text-foreground">
                  {entry.name}
                </h2>
                <p className="mt-1 font-mono text-sm text-muted">U+{entry.codePoint}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-muted/70 uppercase">Category</dt>
                <dd className="mt-0.5 text-foreground">{getCategory(entry.category).name}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-muted/70 uppercase">Block</dt>
                <dd className="mt-0.5 text-foreground">{getBlock(entry.block)?.name ?? entry.block}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-muted/70 uppercase">Unicode version</dt>
                <dd className="mt-0.5 text-foreground">{entry.unicodeVersion}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-muted/70 uppercase">Code point</dt>
                <dd className="mt-0.5 font-mono text-xs text-foreground">
                  {toHtmlEntity(entry.codePoint)} · {toUnicodeEscape(entry.codePoint)}
                </dd>
              </div>
              {entry.keywords.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-[10px] font-bold tracking-wider text-muted/70 uppercase">Keywords</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {entry.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted"
                      >
                        {keyword}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCopy(entry)}
                className="btn-gradient inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Copy className="size-4" aria-hidden />
                Copy symbol
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite(entry.slug)}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  favorite
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border glass text-muted hover:border-primary/50 hover:text-primary",
                )}
              >
                <Heart className={cn("size-4", favorite && "fill-primary")} aria-hidden />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
