import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { THEME_LIST, THEMES } from "@/lib/usernames/themes";
import type { UsernameThemeKey } from "@/lib/usernames/types";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";
import { PageContentGuide } from "@/components/seo/PageContentGuide";
import { getUsernameThemeContent } from "@/lib/seo/content";

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
    description: `Generate stylish ${themeObj.name.toLowerCase()} usernames and aesthetic handle ideas for Discord, Instagram, TikTok, and games. 100% free and copy-paste ready.`,
    path: `/usernames/${themeObj.key}`,
    keywords: [`${themeObj.name.toLowerCase()} usernames`, `${themeObj.name.toLowerCase()} handles`, "username generator"],
  });
}

import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default async function UsernameThemePage({ params }: Props) {
  const { theme: slug } = await params;
  const themeObj = THEMES[slug as UsernameThemeKey];

  if (!themeObj) {
    notFound();
  }

  const content = getUsernameThemeContent(themeObj);
  const otherThemes = THEME_LIST.filter((t) => t.key !== themeObj.key).slice(0, 8);

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

      <PageContentGuide
        title={content.introTitle}
        intro={content.introParagraph}
        faqs={content.faqs}
      />

      {/* Sibling Theme Explorer */}
      <section className="mt-16 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Explore Other Username Themes</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherThemes.map((t) => (
            <Link
              key={t.key}
              href={`/usernames/${t.key}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  {t.name}
                </span>
                <span className="mt-1 block text-xs text-muted line-clamp-1">
                  {t.description}
                </span>
              </div>
              <span className="mt-2 text-xs font-semibold text-primary">Generate →</span>
            </Link>
          ))}
        </div>
      </section>

      <RelatedClusters currentPath={`/usernames/${themeObj.key}`} />
    </div>
  );
}
