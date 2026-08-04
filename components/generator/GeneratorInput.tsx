"use client";

import { ClipboardPaste, Pencil, Shuffle, Sparkles, Wand2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratorInputProps {
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  onSurprise: () => void;
  onClear: () => void;
  onPaste?: () => void;
  onCopyBest?: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function GeneratorInput({
  value,
  maxLength,
  onChange,
  onSurprise,
  onClear,
  onPaste,
  onCopyBest,
  textareaRef,
}: GeneratorInputProps) {
  const count = Array.from(value).length;

  return (
    <div className="space-y-4">
      {/* Top Label Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase backdrop-blur-sm">
          <Pencil className="size-3" aria-hidden />
          TYPE SOMETHING
        </div>
        {value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground transition-colors"
          >
            <X className="size-3.5" aria-hidden />
            Clear
          </button>
        )}
      </div>

      {/* Textarea Box */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-4 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your text here..."
          rows={3}
          aria-label="Text to convert"
          className="block min-h-24 w-full resize-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none"
        />
        <div className="flex justify-end pt-1">
          <p
            className={cn(
              "text-xs font-mono font-medium tabular-nums",
              count >= maxLength ? "text-secondary font-bold" : "text-muted-foreground",
            )}
            aria-live="polite"
          >
            {count.toLocaleString()} / {maxLength.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quick Actions Row */}
      {(onPaste || onCopyBest) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {onPaste && (
            <button
              type="button"
              onClick={onPaste}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 text-xs font-bold text-foreground/90 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ClipboardPaste className="size-3.5" aria-hidden />
              Paste
            </button>
          )}
          {onCopyBest && (
            <button
              type="button"
              onClick={onCopyBest}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/25 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Sparkles className="size-3.5" aria-hidden />
              Copy best style
            </button>
          )}
        </div>
      )}

      {/* Your Styles Header Row */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase backdrop-blur-sm">
          <Wand2 className="size-3" aria-hidden />
          YOUR STYLES
        </div>
        <button
          type="button"
          onClick={onSurprise}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/25 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Shuffle className="size-3.5" aria-hidden />
          Surprise me
        </button>
      </div>
    </div>
  );
}
