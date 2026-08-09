import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  KAOMOJI_CATEGORY_LIST,
  getKaomojiCategoryBySlug,
} from "@/lib/kaomoji/categories";
import { getKaomojisByCategory } from "@/lib/kaomoji/data";
import { CategoryKaomojiClient } from "./CategoryKaomojiClient";
import { PageContentGuide } from "@/components/seo/PageContentGuide";
import { getKaomojiCategoryContent } from "@/lib/seo/content";

import { constructMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return KAOMOJI_CATEGORY_LIST.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getKaomojiCategoryBySlug(slug);

  if (!category) {
    return constructMetadata({ title: "Category Not Found — Glyphtiq", noIndex: true });
  }

  const items = getKaomojisByCategory(category.key);

  return constructMetadata({
    title: `${category.name} Kaomoji (${items.length}) — Copy Japanese Text Faces — Glyphtiq`,
    description: `Browse and copy ${items.length} ${category.name} Japanese kaomojis, emoticons, and cute text faces. One-click copy-paste ready for Discord, TikTok, and chat messages.`,
    path: `/kaomojis/${category.slug}`,
    keywords: [category.name.toLowerCase(), `${category.name.toLowerCase()} kaomoji`, "japanese text faces", "emoticons"],
  });
}

import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default async function KaomojiCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getKaomojiCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const items = getKaomojisByCategory(category.key);
  const content = getKaomojiCategoryContent(category, items.length);
  const otherCategories = KAOMOJI_CATEGORY_LIST.filter(
    (c) => c.slug !== category.slug,
  ).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/kaomoji" className="transition-colors hover:text-foreground">
          Kaomoji
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>

      <header className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {category.name} Kaomojis
            </h1>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              {category.description} Click any emoticon to copy it instantly to your clipboard.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-center">
            <span className="text-xl font-bold text-primary">{items.length}</span>
            <span className="block text-[11px] font-medium text-muted">Kaomojis</span>
          </div>
        </div>
      </header>

      <CategoryKaomojiClient items={items} />

      <PageContentGuide
        title={content.introTitle}
        intro={content.introParagraph}
        faqs={content.faqs}
      />

      {/* Sibling Category Explorer */}
      <section className="mt-16 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Explore Other Kaomoji Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kaomojis/${cat.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  {cat.name}
                </span>
                <span className="mt-1 block text-xs text-muted line-clamp-1">
                  {cat.description}
                </span>
              </div>
              <span className="mt-2 text-xs font-semibold text-primary">Browse →</span>
            </Link>
          ))}
        </div>
      </section>

      <RelatedClusters currentPath={`/kaomojis/${category.slug}`} />
    </div>
  );
}
