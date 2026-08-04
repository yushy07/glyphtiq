"use client";

import Link from "next/link";
import { Copy, Heart, X } from "lucide-react";
import type { KaomojiEntry } from "@/lib/kaomoji/types";

interface Props {
  entry: KaomojiEntry | null;
  favorite: boolean;
  onClose: () => void;
  onCopy: (entry: KaomojiEntry) => void;
  onToggleFavorite: (slug: string) => void;
}

export function KaomojiModal({
  entry,
  favorite,
  onClose,
  onCopy,
  onToggleFavorite,
}: Props) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold capitalize text-primary">
              {entry.category} Kaomoji
            </span>
            <h3 className="text-lg font-bold text-foreground line-clamp-1">
              {entry.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/60 p-8 shadow-inner">
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {entry.expression}
          </span>
          <span className="mt-2 text-xs font-medium text-muted">
            Emotion: {entry.emotion}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onCopy(entry)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow"
          >
            <Copy className="size-4" />
            <span>Copy Kaomoji</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(entry.slug)}
            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold transition-colors ${
              favorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border glass text-foreground"
            }`}
          >
            <Heart className={`size-4 ${favorite ? "fill-current" : ""}`} />
            <span>{favorite ? "Favorited" : "Favorite"}</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-border/60 text-center">
          <Link
            href={`/kaomoji/${entry.slug}`}
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Full Meaning & Related Kaomojis →
          </Link>
        </div>
      </div>
    </div>
  );
}
