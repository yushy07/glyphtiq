"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Gamepad2, Grid2x2, Heart, Mic } from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import type { AppType } from "@/lib/text-engine/types";

const GROUPS: Array<{ type: AppType; label: string; icon: typeof Heart }> = [
  { type: "social", label: "Social", icon: Heart },
  { type: "gaming", label: "Gaming", icon: Gamepad2 },
  { type: "creator", label: "Creators", icon: Mic },
];

export function AppsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none"
      >
        <Grid2x2 className="size-3.5 text-muted" aria-hidden />
        <span>Apps</span>
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute top-full right-0 z-40 mt-2 max-h-[70vh] w-[26rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border glass p-3 shadow-xl shadow-black/40"
          >
            {GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.type} className="mb-2 last:mb-0">
                  <p className="flex items-center gap-1.5 px-2 pb-1 pt-2 text-[10px] font-bold tracking-wider text-muted uppercase">
                    <Icon className="size-3" aria-hidden />
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {APPS_BY_TYPE[group.type].map((app) => (
                      <Link
                        key={app.slug}
                        href={`/${app.slug}`}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                      >
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: app.accent }} aria-hidden />
                        <span className="truncate">{app.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <Link
              href="/fonts"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
            >
              All fonts &amp; generators
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
