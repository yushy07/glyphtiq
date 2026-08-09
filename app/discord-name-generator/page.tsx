import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Discord Name Generator — Aesthetic & Cool Discord Usernames — Glyphtiq",
  description: "Create cool, aesthetic, and funny Discord usernames, nickname tags, and server handles. Fast, instant, and copy-paste ready in one click.",
  path: "/discord-name-generator",
  keywords: ["discord name generator", "discord username generator", "cool discord nicknames", "aesthetic discord names"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function DiscordNamePage() {
  const appJsonLd = getWebApplicationJsonLd(
    "Discord Name Generator",
    "Create cool, aesthetic, and funny Discord usernames and nicknames.",
    "/discord-name-generator",
  );
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Discord Name Generator", path: "/discord-name-generator" },
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
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Discord Name Generator", path: "/discord-name-generator" }]} />
      <UsernameStudio initialPlatform="discord" initialTheme="aesthetic" />
      <RelatedClusters currentPath="/discord-name-generator" />
    </div>
  );
}
