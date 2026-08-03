"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gamepad2, Search, Sparkles, X } from "lucide-react";
import { searchStyles } from "@/lib/text-engine/engine";
import { APP_CONFIGS } from "@/lib/text-engine/apps";
import type { TextStyle } from "@/lib/text-engine/types";

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const appMatches = trimmed
    ? APP_CONFIGS.filter(
        (app) =>
          app.name.toLowerCase().includes(trimmed) ||
          app.title.toLowerCase().includes(trimmed),
      ).slice(0, 5)
    : [];

  const styleMatches: TextStyle[] = trimmed ? searchStyles(query).slice(0, 6) : [];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hasResults = appMatches.length > 0 || styleMatches.length > 0;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search fonts, apps..."
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && trimmed) {
              e.preventDefault();
              setOpen(false);
              router.push(`/?q=${encodeURIComponent(trimmed)}`);
            }
          }}
          aria-label="Search fonts and apps"
          className="h-9 w-44 sm:w-52 md:w-56 rounded-full border border-border/80 bg-surface/60 backdrop-blur-md pl-9 pr-8 text-xs text-foreground placeholder:text-muted/70 focus-visible:outline-none focus-visible:border-primary/50 transition-all"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && trimmed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute top-full right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border glass p-2 shadow-xl shadow-black/40"
          >
            {!hasResults && (
              <p className="px-3 py-4 text-center text-sm text-muted">
                No apps or styles match “{trimmed}”.
              </p>
            )}

            {appMatches.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-wider text-muted uppercase">
                  Apps
                </p>
                {appMatches.map((app) => (
                  <Link
                    key={app.slug}
                    href={`/${app.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                  >
                    <Gamepad2 className="size-4 text-muted" aria-hidden />
                    <span className="flex-1 truncate">{app.name}</span>
                    <ArrowRight className="size-3.5 text-muted" aria-hidden />
                  </Link>
                ))}
              </>
            )}

            {styleMatches.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-wider text-muted uppercase">
                  Styles
                </p>
                {styleMatches.map((style) => (
                  <Link
                    key={style.id}
                    href={`/?q=${encodeURIComponent(trimmed)}&style=${style.id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                  >
                    <Sparkles className="size-4 text-primary" aria-hidden />
                    <span className="flex-1 truncate">{style.name}</span>
                    <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                      {style.category}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
