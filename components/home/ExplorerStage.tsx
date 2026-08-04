"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Grid2x2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { StageDivider } from "./StageDivider";

export interface ExplorerStageProps {
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The Explorer itself — only mounted once the stage is opened. */
  children: ReactNode;
}

/** Stage 3: a gate first ("Browse all N styles"), then the full Explorer.
 *  The Explorer mounts on click or the moment the gate scrolls into view, so
 *  it never renders on first paint. */
export function ExplorerStage({ count, open, onOpenChange, children }: ExplorerStageProps) {
  const gateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gateRef.current;
    if (!el || open || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.05)) {
          onOpenChange(true);
        }
      },
      { threshold: [0.05, 0.25] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, onOpenChange]);

  return (
    <section aria-label="Explorer" className="mx-auto w-full max-w-5xl px-4">
      <StageDivider
        emoji="🗂️"
        title={`Browse all ${count.toLocaleString()} styles`}
        subtitle={`Search, filter and sort the full library, then copy your favorites.`}
      />
      {open ? (
        children
      ) : (
        <div
          ref={gateRef}
          className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 glass px-6 py-12 text-center"
        >
          <span className="grid size-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Grid2x2 className="size-6" aria-hidden />
          </span>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            All {count.toLocaleString()} styles are here — everything from bold to zalgo,
            with search, filters and sorting.
          </p>
          <Button onClick={() => onOpenChange(true)}>
            <Grid2x2 className="size-4" aria-hidden />
            Explore Library
          </Button>
        </div>
      )}
    </section>
  );
}
