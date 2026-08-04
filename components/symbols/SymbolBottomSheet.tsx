"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Heart, X } from "lucide-react";
import type { SymbolEntry } from "@/lib/symbols/types";

interface Props {
  entry: SymbolEntry | null;
  favorite: boolean;
  onClose: () => void;
  onCopy: (entry: SymbolEntry) => void;
  onToggleFavorite: (slug: string) => void;
}

export function SymbolBottomSheet({
  entry,
  favorite,
  onClose,
  onCopy,
  onToggleFavorite,
}: Props) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  if (!entry) return null;

  const handleCopyVariant = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full rounded-t-3xl border-t border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border/60" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-3xl font-bold shadow-inner">
              {entry.char}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground line-clamp-1">
                {entry.name}
              </h3>
              <p className="text-xs font-mono text-muted">
                U+{entry.codePoint} • {entry.unicodeVersion}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onCopy(entry)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow"
          >
            <Copy className="size-4" />
            <span>Copy Symbol</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(entry.slug)}
            className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
              favorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border glass text-foreground"
            }`}
          >
            <Heart className={`size-4 ${favorite ? "fill-current" : ""}`} />
            <span>{favorite ? "Favorited" : "Favorite"}</span>
          </button>
        </div>

        {entry.copyVariants && entry.copyVariants.length > 0 && (
          <div className="mt-4 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {entry.copyVariants.map((variant) => {
              const isCopied = copiedLabel === variant.label;
              return (
                <div
                  key={variant.label}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-xs"
                >
                  <span className="text-muted text-[11px] font-medium">
                    {variant.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-foreground">
                      {variant.value}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyVariant(variant.value, variant.label)}
                      className="text-[10px] font-semibold text-primary hover:underline"
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/60 text-center">
          <Link
            href={`/symbol/${entry.slug}`}
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Full Unicode Details & History →
          </Link>
        </div>
      </div>
    </div>
  );
}
