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
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-[#121218]/85 px-3.5 py-1.5 text-xs text-muted backdrop-blur-xl hover:border-white/20 hover:bg-[#161620]/92 hover:text-foreground transition-all"
      >
        <Search className="size-3.5" aria-hidden />
        <span>Search anything...</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Universal search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/12 bg-[#101016]/92 p-4 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in duration-150">
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
                No matching symbols, kaomojis, or fonts found for &ldquo;{query}&rdquo;.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
