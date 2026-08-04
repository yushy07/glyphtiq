"use client";

import Link from "next/link";
import { Check, Copy, Heart, Info } from "lucide-react";
import type { KaomojiEntry } from "@/lib/kaomoji/types";

interface Props {
  entry: KaomojiEntry;
  favorite: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggleFavorite: () => void;
  onInfo: () => void;
}

export function KaomojiCard({
  entry,
  favorite,
  copied,
  onCopy,
  onToggleFavorite,
  onInfo,
}: Props) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-xl">
      <div className="flex items-center justify-between gap-1 text-[11px] text-muted">
        <span className="font-semibold capitalize truncate">{entry.category}</span>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={favorite ? "Unfavorite kaomoji" : "Favorite kaomoji"}
          className={`rounded-md p-1 transition-colors ${
            favorite ? "text-amber-500" : "text-muted hover:text-foreground"
          }`}
        >
          <Heart className={`size-3.5 ${favorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="my-3 flex items-center justify-center min-h-[64px] text-center">
        <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-transform group-hover:scale-105">
          {entry.expression}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
        <Link
          href={`/kaomoji/${entry.slug}`}
          className="text-[11px] font-medium text-muted hover:text-primary transition-colors line-clamp-1"
        >
          {entry.name}
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onInfo}
            aria-label="View kaomoji details"
            className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <Info className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={onCopy}
            className={`flex items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow"
            }`}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
