"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Trash2, X } from "lucide-react";
import type { ConvertedResult } from "@/lib/text-engine/types";

interface ComparisonTrayProps {
  items: ConvertedResult[];
  onCopy: (result: ConvertedResult) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const MAX_COMPARE = 4;

export function ComparisonTray({ items, onCopy, onRemove, onClear }: ComparisonTrayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (items.length === 0) return null;

  function handleCopy(result: ConvertedResult) {
    onCopy(result);
    setCopiedId(result.style.id);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setCopiedId((current) => (current === result.style.id ? null : current));
    }, 1500);
  }

  return (
    <section className="mt-8" aria-label="Comparison tray">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">Compare</h2>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {items.length}/{MAX_COMPARE}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Clear all
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((result) => (
          <article
            key={result.style.id}
            className="flex flex-col rounded-2xl border border-border glass p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-xs font-bold text-foreground">{result.style.name}</h3>
              <button
                type="button"
                onClick={() => onRemove(result.style.id)}
                aria-label={`Remove ${result.style.name} from comparison`}
                className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 line-clamp-3 min-h-14 flex-1 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
              {result.text}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(result)}
              className={cnCompareButton(copiedId === result.style.id)}
            >
              {copiedId === result.style.id ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              {copiedId === result.style.id ? "Copied" : "Copy"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function cnCompareButton(copied: boolean): string {
  return copied
    ? "mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-success/15 text-xs font-bold text-success transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    : "mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-surface-2/60 text-xs font-bold text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
}
