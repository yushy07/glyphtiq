import type { Metadata } from "next";
import { KaomojiExplorer } from "@/components/kaomoji/KaomojiExplorer";
import { getKaomojiCount } from "@/lib/kaomoji/data";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Kaomoji & Emoticons — Copy Japanese Text Faces — Glyphtiq",
  description: `Browse and copy ${getKaomojiCount().toLocaleString()} Japanese kaomojis, emoticons, and text faces for Discord, Twitter, and chat. Fast, instant, and no login required.`,
  path: "/kaomoji",
  keywords: ["kaomoji", "japanese emoticons", "shrug face", "text faces", "cute text emoticons"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function KaomojiPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Kaomoji", path: "/kaomoji" }]} />
      <KaomojiExplorer />
      <RelatedClusters currentPath="/kaomoji" />
    </div>
  );
}
