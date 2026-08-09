import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SYMBOL_CATEGORY_LIST,
  getCategoryBySlug,
} from "@/lib/symbols/categories";
import { getSymbolsByCategory } from "@/lib/symbols/data";
import { SYMBOL_COLLECTIONS } from "@/lib/symbols/collections";
import { CategoryExplorerClient } from "./CategoryExplorerClient";
import { PageContentGuide } from "@/components/seo/PageContentGuide";
import { getSymbolCategoryContent } from "@/lib/seo/content";

import { constructMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return SYMBOL_CATEGORY_LIST.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return constructMetadata({ title: "Category Not Found — Glyphtiq", noIndex: true });
  }

  const symbolCount = getSymbolsByCategory(category.key).length;

  return constructMetadata({
    title: `${category.name} Symbols (${symbolCount}) — Copy & Paste — Glyphtiq`,
    description: `Browse and copy ${symbolCount} ${category.name} Unicode symbols. Click any symbol to copy with JS escape and code points. Copy-paste ready for any app.`,
    path: `/symbols/${category.slug}`,
    keywords: [category.name.toLowerCase(), `${category.name.toLowerCase()} symbols`, "unicode symbols", "copy paste symbols"],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categorySymbols = getSymbolsByCategory(category.key);
  const content = getSymbolCategoryContent(category, categorySymbols.length);
  const otherCategories = SYMBOL_CATEGORY_LIST.filter(
    (c) => c.slug !== category.slug,
  ).slice(0, 8);

  const relatedCollections = SYMBOL_COLLECTIONS.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/symbols" className="transition-colors hover:text-foreground">
          Symbols
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <header className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {category.name} Symbols
            </h1>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              {category.description} Click any symbol to copy it to your clipboard.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-center">
            <span className="text-xl font-bold text-primary">
              {categorySymbols.length.toLocaleString()}
            </span>
            <span className="block text-[11px] font-medium text-muted">
              Symbols
            </span>
          </div>
        </div>
      </header>

      {/* Interactive Symbol Grid */}
      <CategoryExplorerClient symbols={categorySymbols} />

      {/* On-page Guide and FAQ Section */}
      <PageContentGuide
        title={content.introTitle}
        intro={content.introParagraph}
        faqs={content.faqs}
      />

      {/* Other Categories */}
      <section className="mt-16 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Explore Other Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/symbols/${cat.slug}`}
              className="group flex flex-col rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
            >
              <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                {cat.name}
              </span>
              <span className="mt-1 text-xs text-muted line-clamp-1">
                {cat.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Collections */}
      <section className="mt-8 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Popular Thematic Collections</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {relatedCollections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="flex flex-col rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
            >
              <span className="font-bold text-foreground text-sm">{col.name}</span>
              <span className="mt-1 text-xs text-muted">{col.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
