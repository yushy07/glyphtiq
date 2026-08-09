import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Free Fire Name Generator — Stylish FF Nicknames & Symbols — Glyphtiq",
  description: "Generate stylish Free Fire nicknames with Japanese symbols and clan tags under Garena rule limits. 100% free and copy-paste ready.",
  path: "/free-fire-name-generator",
  keywords: ["free fire name generator", "ff nickname generator", "free fire symbol names", "garena ff names"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function FreeFireNamePage() {
  const appJsonLd = getWebApplicationJsonLd(
    "Free Fire Name Generator",
    "Generate stylish Free Fire nicknames with Japanese symbols and clan tags.",
    "/free-fire-name-generator",
  );
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Free Fire Name Generator", path: "/free-fire-name-generator" },
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
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Free Fire Name Generator", path: "/free-fire-name-generator" }]} />
      <UsernameStudio initialPlatform="freeFire" initialTheme="warrior" />
      <RelatedClusters currentPath="/free-fire-name-generator" />
    </div>
  );
}
