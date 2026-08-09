import type { Metadata } from "next";
import { SymbolsExplorer } from "@/components/symbols/SymbolsExplorer";
import { getSymbolCount } from "@/lib/symbols/data";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Symbols — Copy & Paste Unicode Symbols Library — Glyphtiq",
  description: `Browse and copy ${getSymbolCount().toLocaleString()} Unicode symbols including hearts, stars, arrows, aesthetic signs, and box art. Free, instant, and copy-paste ready.`,
  path: "/symbols",
  keywords: ["unicode symbols", "copy paste symbols", "heart symbols", "star symbols", "aesthetic text symbols"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function SymbolsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Symbols", path: "/symbols" }]} />
      <SymbolsExplorer />
      <RelatedClusters currentPath="/symbols" />
    </div>
  );
}
