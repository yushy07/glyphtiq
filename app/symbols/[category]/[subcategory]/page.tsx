import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SYMBOL_CATEGORY_LIST, getSymbolCategoryBySlug } from "@/lib/symbols/categories";
import { getSymbolsByCategory } from "@/lib/symbols/data";
import { CategoryExplorerClient } from "../CategoryExplorerClient";

import { constructMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ category: string; subcategory: string }> = [];
  for (const cat of SYMBOL_CATEGORY_LIST) {
    for (const sub of cat.subcategories) {
      params.push({ category: cat.slug, subcategory: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catSlug, subcategory: subSlug } = await params;
  const category = getSymbolCategoryBySlug(catSlug);
  const subcategory = category?.subcategories.find((s) => s.slug === subSlug);

  if (!category || !subcategory) {
    return constructMetadata({ title: "Subcategory Not Found — Glyphtiq", noIndex: true });
  }

  return constructMetadata({
    title: `${subcategory.name} — Copy ${category.name} Symbols — Glyphtiq`,
    description: `Browse and copy ${subcategory.name} (${category.name}). ${subcategory.description} Instant copy for Instagram, Discord, and messaging.`,
    path: `/symbols/${category.slug}/${subcategory.slug}`,
    keywords: [subcategory.name.toLowerCase(), `${subcategory.name.toLowerCase()} symbols`, category.name.toLowerCase()],
  });
}

export default async function SubcategoryPage({ params }: Props) {
  const { category: catSlug, subcategory: subSlug } = await params;
  const category = getSymbolCategoryBySlug(catSlug);
  const subcategory = category?.subcategories.find((s) => s.slug === subSlug);

  if (!category || !subcategory) {
    notFound();
  }

  const allCategorySymbols = getSymbolsByCategory(category.key);
  const filtered = allCategorySymbols.filter(
    (s) => s.name.toLowerCase().includes(subSlug) || s.tags.includes(subSlug) || s.keywords.includes(subSlug),
  );
  const displayItems = filtered.length > 0 ? filtered : allCategorySymbols.slice(0, 40);

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
        <Link href={`/symbols/${category.slug}`} className="transition-colors hover:text-foreground">
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{subcategory.name}</span>
      </nav>

      <header className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {subcategory.name}
        </h1>
        <p className="mt-2 text-sm text-muted max-w-2xl">
          {subcategory.description} Click any symbol to copy it instantly to your clipboard.
        </p>
      </header>

      <CategoryExplorerClient symbols={displayItems} />
    </div>
  );
}
