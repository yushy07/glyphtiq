import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Free Fire Name Generator — Stylish FF Nicknames & Symbols — Glyphtiq",
  description: "Generate stylish Free Fire nicknames with Japanese symbols (ツ, 乂, 〆, 么, 彡). Verified against Garena Free Fire 12-character rule limits with instant copy.",
  path: "/free-fire-name-generator",
  keywords: ["free fire name generator", "ff nickname generator", "free fire symbol names", "garena ff names"],
});

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
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <UsernameStudio initialPlatform="freeFire" initialTheme="warrior" />
    </div>
  );
}
