import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Valorant Name Generator — Tactical & Pro Valorant IGNs — Glyphtiq",
  description: "Generate clean, pro, and tactical Valorant IGN player handles tested for Riot Games character limits. Free and works right in your browser.",
  path: "/valorant-name-generator",
  keywords: ["valorant name generator", "valorant ign generator", "pro valorant names", "cool riot igns"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function ValorantNamePage() {
  const appJsonLd = getWebApplicationJsonLd(
    "Valorant Name Generator",
    "Generate clean, pro, and tactical Valorant IGN player handles.",
    "/valorant-name-generator",
  );
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Valorant Name Generator", path: "/valorant-name-generator" },
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Valorant Name Generator", path: "/valorant-name-generator" }]} />
      <UsernameStudio initialPlatform="valorant" initialTheme="ninja" />
      <RelatedClusters currentPath="/valorant-name-generator" />
    </div>
  );
}
