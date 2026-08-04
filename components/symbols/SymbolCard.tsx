"use client";

import { Check, Heart, Info } from "lucide-react";
import type { SymbolEntry } from "@/lib/symbols/types";
import { cn } from "@/lib/utils";

interface SymbolCardProps {
  entry: SymbolEntry;
  favorite: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggleFavorite: () => void;
  onInfo: () => void;
}

export function SymbolCard({
  entry,
  favorite,
  copied,
  onCopy,
  onToggleFavorite,
  onInfo,
}: SymbolCardProps) {
  return (
    <div
      className={cn(
        "relative h-28 overflow-hidden rounded-xl border bg-surface-2/40 transition-colors",
        copied ? "border-success/60" : "border-border hover:border-primary/50",
      )}
    >
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${entry.name} symbol`}
        title={`Copy ${entry.name}`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl px-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {copied ? (
          <span className="flex flex-col items-center gap-1 text-success">
            <Check className="size-5" aria-hidden />
            <span className="text-[10px] font-bold tracking-wide uppercase">Copied</span>
          </span>
        ) : (
          <>
            <span className="text-2xl leading-none text-foreground" aria-hidden>
              {entry.char}
            </span>
            <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-muted">
              {entry.name}
            </span>
          </>
        )}
      </button>

      <div className="absolute top-1.5 right-1.5 flex gap-1">
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={
            favorite
              ? `Remove ${entry.name} from favorites`
              : `Favorite ${entry.name}`
          }
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          className="grid size-6 place-items-center rounded-full border border-border bg-background/80 text-muted shadow-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Heart
            className={cn("size-3", favorite && "fill-primary text-primary")}
            aria-hidden
          />
        </button>
        <button
          type="button"
          onClick={onInfo}
          aria-label={`Details for ${entry.name}`}
          title="View details"
          className="grid size-6 place-items-center rounded-full border border-border bg-background/80 text-muted shadow-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Info className="size-3" aria-hidden />
        </button>
      </div>
    </div>
  );
}
