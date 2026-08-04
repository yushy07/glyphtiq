"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { universalSearch } from "@/lib/platform/search";
import type { UniversalSearchResult } from "@/lib/platform/types";

export function UniversalSearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UniversalSearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const matches = universalSearch(query, 24);
    setResults(matches);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3.5 py-1.5 text-xs text-muted hover:border-primary/50 hover:text-foreground transition-all"
      >
        <Search className="size-3.5" />
        <span>Search anything...</span>
        <kbd className="hidden rounded border border-border/60 bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-border bg-card p-4 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3 px-2">
              <Search className="size-5 text-muted" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symbols, kaomojis, usernames, fonts, collections..."
                className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-surface-2"
              >
                <X className="size-4" />
              </button>
            </div>

            {results.length > 0 && (
              <div className="mt-3 max-h-80 overflow-y-auto space-y-1.5 pr-1">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={r.url}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-3 hover:border-primary/50 hover:bg-card transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-bold text-foreground w-10 text-center">
                        {r.preview}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          {r.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-primary">
                          {r.type} {r.category ? `• ${r.category}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted hover:text-primary">
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="py-8 text-center text-xs text-muted">
                No matching symbols, kaomojis, or fonts found for "{query}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
