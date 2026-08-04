import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Aesthetic Username Generator — Create Cool Handles — Glyphtiq",
  description: "Generate memorable, stylish, and platform-compatible usernames for Instagram, TikTok, Discord, Free Fire, PUBG, Valorant, and Roblox with instant availability checks.",
  path: "/username-generator",
  keywords: ["username generator", "aesthetic usernames", "cool instagram handles", "discord username ideas"],
});

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default function UsernameGeneratorPage() {
  const appJsonLd = getWebApplicationJsonLd(
    "Aesthetic Username Generator",
    "Generate memorable, stylish, and platform-compatible usernames for Instagram, TikTok, Discord, and gaming.",
    "/username-generator",
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <Breadcrumbs items={[{ name: "Username Generator", path: "/username-generator" }]} />
      <UsernameStudio initialPlatform="instagram" initialTheme="minimal" />
      <RelatedClusters currentPath="/username-generator" />
    </div>
  );
}
