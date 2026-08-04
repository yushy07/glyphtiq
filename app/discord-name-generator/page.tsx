import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Discord Name Generator — Aesthetic & Cool Discord Usernames — Glyphtiq",
  description: "Create cool, aesthetic, and funny Discord usernames and nicknames. Supports spaces, symbols, and custom decorations with instant copy.",
  path: "/discord-name-generator",
  keywords: ["discord name generator", "discord username generator", "cool discord nicknames", "aesthetic discord names"],
});

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
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <UsernameStudio initialPlatform="discord" initialTheme="aesthetic" />
    </div>
  );
}
