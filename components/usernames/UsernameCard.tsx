"use client";

import { Check, Copy, Heart, ShieldCheck } from "lucide-react";
import type { UsernameResult } from "@/lib/usernames/types";

interface Props {
  result: UsernameResult;
  favorite: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggleFavorite: () => void;
}

export function UsernameCard({
  result,
  favorite,
  copied,
  onCopy,
  onToggleFavorite,
}: Props) {
  const isHighQuality = result.score.totalScore >= 80;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-xl">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-primary capitalize">{result.theme}</span>
          {isHighQuality && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="size-3" />
              Score {result.score.totalScore}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={favorite ? "Unfavorite username" : "Favorite username"}
          className={`rounded-md p-1 transition-colors ${
            favorite ? "text-amber-500" : "text-muted hover:text-foreground"
          }`}
        >
          <Heart className={`size-3.5 ${favorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="my-4 flex items-center justify-center min-h-[48px]">
        <span className="font-mono text-lg font-bold text-foreground transition-transform group-hover:scale-105 text-center break-all">
          {result.username}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3">
        <span className="text-[10px] font-medium text-muted truncate">
          {result.compatiblePlatforms.length} Platforms Compatible
        </span>

        <button
          type="button"
          onClick={onCopy}
          className={`flex items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
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
  );
}
