import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  KAOMOJI_CATEGORY_LIST,
  getKaomojiCategoryBySlug,
} from "@/lib/kaomoji/categories";
import { getKaomojisByCategory } from "@/lib/kaomoji/data";
import { CategoryKaomojiClient } from "./CategoryKaomojiClient";

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
    return { title: "Category Not Found — Glyphtiq" };
  }

  const items = getKaomojisByCategory(category.key);

  return {
    title: `${category.name} Kaomoji (${items.length}) — Copy Japanese Text Faces | Glyphtiq`,
    description: `Browse and copy ${items.length} ${category.name} kaomojis & emoticons. ${category.description} Click to copy instantly for Instagram, Discord, or text chat.`,
  };
}

export default async function KaomojiCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getKaomojiCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const items = getKaomojisByCategory(category.key);

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
    </div>
  );
}
