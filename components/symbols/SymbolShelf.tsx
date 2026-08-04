"use client";

import Link from "next/link";
import type { SymbolEntry } from "@/lib/symbols/types";

interface Props {
  title: string;
  subtitle: string;
  href: string;
  items: SymbolEntry[];
  copiedSlug: string | null;
  onCopy: (entry: SymbolEntry) => void;
}

export function SymbolShelf({
  title,
  subtitle,
  href,
  items,
  copiedSlug,
  onCopy,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="text-xs font-semibold text-primary transition-colors hover:underline"
        >
          View Collection →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {items.map((symbol) => {
          const isCopied = copiedSlug === symbol.slug;
          return (
            <div
              key={symbol.slug}
              className="snap-start group flex flex-col items-center justify-between w-32 shrink-0 rounded-2xl border border-border/60 bg-background/60 p-3.5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
            >
              <Link
                href={`/symbol/${symbol.slug}`}
                className="flex flex-col items-center w-full"
              >
                <span className="text-4xl transition-transform group-hover:scale-110">
                  {symbol.char}
                </span>
                <span className="mt-2 text-center text-[11px] font-semibold text-foreground truncate w-full">
                  {symbol.name}
                </span>
                <span className="text-[10px] font-mono text-muted">
                  U+{symbol.codePoint}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => onCopy(symbol)}
                className={`mt-3 w-full rounded-xl py-1.5 text-xs font-semibold transition-all ${
                  isCopied
                    ? "bg-emerald-500 text-white"
                    : "border border-border glass text-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
