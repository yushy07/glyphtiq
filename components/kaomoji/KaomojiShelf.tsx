"use client";

import Link from "next/link";
import type { KaomojiEntry } from "@/lib/kaomoji/types";

interface Props {
  title: string;
  subtitle: string;
  href: string;
  items: KaomojiEntry[];
  copiedSlug: string | null;
  onCopy: (entry: KaomojiEntry) => void;
}

export function KaomojiShelf({
  title,
  subtitle,
  href,
  items,
  copiedSlug,
  onCopy,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-6">
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
        {items.map((kaomoji) => {
          const isCopied = copiedSlug === kaomoji.slug;
          return (
            <div
              key={kaomoji.id}
              className="snap-start group flex flex-col items-center justify-between w-40 shrink-0 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
            >
              <Link
                href={`/kaomoji/${kaomoji.slug}`}
                className="flex flex-col items-center w-full min-h-[54px] justify-center"
              >
                <span className="font-mono text-lg font-bold text-foreground transition-transform group-hover:scale-105 text-center">
                  {kaomoji.expression}
                </span>
                <span className="mt-2 text-center text-[11px] font-semibold text-muted truncate w-full">
                  {kaomoji.name}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => onCopy(kaomoji)}
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
