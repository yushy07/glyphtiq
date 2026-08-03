"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search, Shapes, X } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";

const SYMBOL_GROUPS: Array<{ name: string; symbols: string[] }> = [
  { name: "Hearts", symbols: ["♡", "♥", "❥", "ღ", "💕", "💗", "ෆ", "ᥫ᭡"] },
  { name: "Stars", symbols: ["★", "☆", "✦", "✧", "⋆", "✩", "✮", "✯"] },
  { name: "Gaming", symbols: ["亗", "乂", "ツ", "メ", "么", "〆", "彡", "々"] },
  { name: "Royal", symbols: ["♛", "♚", "♔", "꧁", "꧂", "༒", "☬", "࿐"] },
  { name: "Brackets", symbols: ["『", "』", "【", "】", "《", "》", "「", "」"] },
  { name: "Arrows", symbols: ["➜", "➤", "→", "↳", "⇢", "➳", "➵", "➸"] },
  { name: "Nature", symbols: ["❀", "✿", "❁", "☘", "𓆸", "⚘", "𖤣", "𖥧"] },
  { name: "Kawaii", symbols: ["୨୧", "૮₍˶ᵔ ᵕ ᵔ˶₎ა", "(˶ᵔ ᵕ ᵔ˶)", "ʚɞ", "꒰ა", "໒꒱"] },
];

interface SymbolLibraryProps {
  onInsert: (symbol: string) => void;
}

export function SymbolLibrary({ onInsert }: SymbolLibraryProps) {
  const { copy } = useClipboard();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SYMBOL_GROUPS;
    return SYMBOL_GROUPS.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.symbols.some((symbol) => symbol.includes(query)),
    );
  }, [search]);

  async function handleCopy(symbol: string) {
    const ok = await copy(symbol);
    if (!ok) return;
    setCopied(symbol);
    window.setTimeout(() => setCopied((current) => (current === symbol ? null : current)), 1200);
  }

  return (
    <section className="mt-8" aria-labelledby="symbol-library-heading">
      <div className="flex items-center gap-2">
        <Shapes className="size-5 text-primary" aria-hidden />
        <h2 id="symbol-library-heading" className="text-sm font-bold tracking-wide text-foreground uppercase">
          Symbols & decorations
        </h2>
      </div>
      <p className="mt-1 text-xs text-muted">
        Tap a symbol to insert it at the cursor, or copy it on its own.
      </p>

      <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-border glass px-3 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hearts, stars, gaming…"
          aria-label="Search symbols"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus-visible:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear symbol search"
            className="grid size-7 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          No symbols match “{search}”.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.name} className="rounded-2xl border border-border glass p-4">
              <h3 className="text-xs font-bold tracking-wide text-muted uppercase">{group.name}</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {group.symbols.map((symbol) => (
                  <div key={symbol} className="relative">
                    <button
                      type="button"
                      onClick={() => onInsert(symbol)}
                      title={`Insert ${symbol}`}
                      className="grid h-11 min-w-11 place-items-center rounded-xl border border-border bg-surface-2/50 px-2 text-lg text-foreground transition-colors hover:border-primary/50 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {symbol}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopy(symbol)}
                      aria-label={`Copy ${symbol}`}
                      className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full border border-border bg-surface text-muted shadow-sm transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {copied === symbol ? (
                        <Check className="size-3 text-success" aria-hidden />
                      ) : (
                        <Copy className="size-3" aria-hidden />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
