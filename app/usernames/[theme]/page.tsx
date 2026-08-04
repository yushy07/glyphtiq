import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { THEME_LIST, THEMES } from "@/lib/usernames/themes";
import type { UsernameThemeKey } from "@/lib/usernames/types";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";

import { constructMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ theme: string }>;
}

export async function generateStaticParams() {
  return THEME_LIST.map((t) => ({
    theme: t.key,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme: slug } = await params;
  const themeObj = THEMES[slug as UsernameThemeKey];

  if (!themeObj) {
    return constructMetadata({ title: "Theme Not Found — Glyphtiq", noIndex: true });
  }

  return constructMetadata({
    title: `${themeObj.name} Usernames — Generator & Ideas — Glyphtiq`,
    description: `Generate ${themeObj.name.toLowerCase()} usernames. ${themeObj.description} Perfect for Instagram, Discord, TikTok, and gaming nicknames.`,
    path: `/usernames/${themeObj.key}`,
    keywords: [`${themeObj.name.toLowerCase()} usernames`, `${themeObj.name.toLowerCase()} handles`, "username generator"],
  });
}

export default async function UsernameThemePage({ params }: Props) {
  const { theme: slug } = await params;
  const themeObj = THEMES[slug as UsernameThemeKey];

  if (!themeObj) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/username-generator" className="transition-colors hover:text-foreground">
          Username Studio
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{themeObj.name}</span>
      </nav>

      <UsernameStudio initialTheme={themeObj.key} />
    </div>
  );
}
