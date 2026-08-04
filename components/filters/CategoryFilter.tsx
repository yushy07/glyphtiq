"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/text-engine/engine";
import type { StyleCategory } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";

export type CategoryFilterValue = StyleCategory | "all";

const LABELS: Record<CategoryFilterValue, string> = {
  all: "All",
  bold: "Bold",
  italic: "Italic",
  cursive: "Cursive",
  bubble: "Bubble",
  gothic: "Gothic",
  monospace: "Mono",
  smallcaps: "Small Caps",
  vaporwave: "Vaporwave",
  upsidedown: "Upside Down",
  underline: "Underline",
  strikethrough: "Strike",
  glitch: "Glitch",
  zalgo: "Zalgo",
  kawaii: "Kawaii",
  symbol: "Symbol",
  decorated: "Decorated",
};

/** Every category as a filter value, starting with "all". */
export const CATEGORY_OPTIONS: CategoryFilterValue[] = ["all", ...CATEGORIES];

export function CategoryPill({
  value,
  active,
  onClick,
  count,
  layoutId = "category-pill-active",
}: {
  value: CategoryFilterValue;
  active: boolean;
  onClick: () => void;
  count?: number;
  layoutId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-transparent text-white shadow-lg shadow-primary/25"
          : "border-border glass text-foreground hover:border-primary/50 hover:text-primary",
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="btn-gradient absolute inset-0 rounded-full"
          aria-hidden
        />
      )}
      <span className="relative">
        {LABELS[value]}
        {typeof count === "number" && (
          <span className={cn("ml-1.5 text-xs font-medium", active ? "text-white/80" : "text-muted")}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
