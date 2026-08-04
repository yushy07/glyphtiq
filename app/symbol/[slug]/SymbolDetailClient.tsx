"use client";

import { useState } from "react";
import Link from "next/link";
import { useSymbolActions } from "@/hooks/useSymbolActions";
import type { SymbolCategory } from "@/lib/symbols/categories";
import type { SymbolEntry } from "@/lib/symbols/types";

interface Props {
  symbol: SymbolEntry;
  category: SymbolCategory;
  relatedSymbols: SymbolEntry[];
  categorySymbols: SymbolEntry[];
}

export function SymbolDetailClient({
  symbol,
  category,
  relatedSymbols,
}: Props) {
  const { copySymbol, toggleFavorite, isFavorite } = useSymbolActions("symbols");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const favorite = isFavorite(symbol.slug);

  const handleCopyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Symbol Main Banner / Hero */}
      <section className="relative flex flex-col items-center justify-between rounded-3xl border border-border/80 bg-card/60 p-8 shadow-xl backdrop-blur-md sm:flex-row sm:p-12">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-6xl shadow-inner transition-transform hover:scale-105 sm:h-36 sm:w-36 sm:text-7xl">
            {symbol.char}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                U+{symbol.codePoint}
              </span>
              {symbol.unicodeVersion && (
                <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-xs font-medium text-muted">
                  Unicode {symbol.unicodeVersion}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {symbol.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Category:{" "}
              <Link
                href={`/symbols/${category.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {category.name}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto">
          <button
            type="button"
            onClick={() => copySymbol(symbol)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
          >
            <span className="text-base">{symbol.char}</span>
            <span>Copy Symbol</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(symbol.slug)}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-colors ${
              favorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border glass text-foreground hover:bg-card"
            }`}
          >
            <span>{favorite ? "★ Favorited" : "☆ Add to Favorites"}</span>
          </button>
        </div>
      </section>

      {/* Code Encodings & Copy Variants */}
      <section className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-foreground">Copy Encodings & Formats</h2>
        <p className="mt-1 text-xs text-muted">
          Copy code representations directly for HTML, JavaScript, CSS, or URLs.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(symbol.copyVariants ?? []).map((variant) => (
            <div
              key={variant.label}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50"
            >
              <div>
                <span className="text-[11px] font-bold text-muted uppercase">
                  {variant.label}
                </span>
                <span className="font-mono text-sm font-semibold text-foreground block mt-0.5">
                  {variant.value}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(variant.value, variant.label)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  copiedKey === variant.label
                    ? "bg-emerald-500 text-white"
                    : "border border-border glass text-foreground hover:border-primary/50"
                }`}
              >
                {copiedKey === variant.label ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Module Recommendations */}
      <section className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Discover More in Glyphtiq</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/fonts"
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
          >
            <div>
              <span className="text-xs font-bold text-primary uppercase">Font Engine</span>
              <p className="text-sm font-bold text-foreground mt-1">Copy Fancy Text Styles</p>
              <p className="text-xs text-muted mt-1">
                Convert your text into aesthetic unicode fonts.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary mt-3 block">Explore Fonts →</span>
          </Link>

          <Link
            href="/kaomoji"
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
          >
            <div>
              <span className="text-xs font-bold text-primary uppercase">Kaomoji Explorer</span>
              <p className="text-sm font-bold text-foreground mt-1">Decorate Text Faces</p>
              <p className="text-xs text-muted mt-1">
                Browse 2,000+ emoticons & compose decorated kaomojis.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary mt-3 block">Explore Kaomojis →</span>
          </Link>

          <Link
            href="/username-generator"
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
          >
            <div>
              <span className="text-xs font-bold text-primary uppercase">Username Studio</span>
              <p className="text-sm font-bold text-foreground mt-1">Create Cool Gaming IGNs</p>
              <p className="text-xs text-muted mt-1">
                Generate platform-verified usernames & clan marks.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary mt-3 block">Open Studio →</span>
          </Link>
        </div>
      </section>

      {/* Similar Symbols */}
      {relatedSymbols.length > 0 && (
        <section className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Related {category.name} Symbols</h2>
            <Link href={`/symbols/${category.slug}`} className="text-xs font-semibold text-primary hover:underline">
              View All {category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
            {relatedSymbols.map((rel) => (
              <Link
                key={rel.slug}
                href={`/symbol/${rel.slug}`}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
              >
                <span className="text-2xl font-bold text-foreground">{rel.char}</span>
                <span className="mt-2 text-[10px] font-medium text-muted truncate w-full text-center">
                  {rel.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
