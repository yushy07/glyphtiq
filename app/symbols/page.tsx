import type { Metadata } from "next";
import { SymbolsExplorer } from "@/components/symbols/SymbolsExplorer";
import { getSymbolCount } from "@/lib/symbols/data";

export const metadata: Metadata = {
  title: "Symbols — Copy & Paste Symbols Library",
  description:
    `Browse and copy ${getSymbolCount().toLocaleString()} Unicode symbols — hearts, arrows, stars, math signs, box drawing and more. Click any symbol to copy it instantly.`,
};

export default function SymbolsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <SymbolsExplorer />
    </div>
  );
}
