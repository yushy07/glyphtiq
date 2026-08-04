import type { Metadata } from "next";
import Link from "next/link";
import { symbols } from "@/lib/symbols/data";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Browse Symbols by Unicode Block — Glyphtiq",
  description: "Browse Unicode symbols organized by Unicode Standard blocks: General Punctuation, Arrows, Math Operators, Box Drawing, Dingbats, Braille, and Currency.",
  path: "/symbols/blocks",
  keywords: ["unicode blocks", "unicode standard", "math operators", "dingbats", "braille symbols"],
});

export default function UnicodeBlocksPage() {
  const blocksMap = new Map<string, number>();
  for (const s of symbols) {
    blocksMap.set(s.block, (blocksMap.get(s.block) ?? 0) + 1);
  }

  const blocksList = Array.from(blocksMap.entries()).map(([key, count]) => ({
    key,
    count,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Browse by Unicode Block
        </h1>
        <p className="text-sm text-muted mt-2">
          Explore {symbols.length.toLocaleString()} Unicode symbols categorized by official Unicode Standard blocks.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocksList.map((block) => (
          <div
            key={block.key}
            className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-5 transition-all hover:border-primary/50"
          >
            <div>
              <span className="font-bold text-foreground capitalize block">
                {block.key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-xs text-muted font-medium">
                {block.count} Symbols
              </span>
            </div>
            <Link
              href="/symbols"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Browse →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
