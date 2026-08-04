import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKaomojiCategory } from "@/lib/kaomoji/categories";
import { getKaomojiBySlug, kaomojis } from "@/lib/kaomoji/data";
import { getRelatedKaomojis } from "@/lib/kaomoji/related";
import { KaomojiDetailClient } from "./KaomojiDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return kaomojis.slice(0, 300).map((k) => ({
    slug: k.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getKaomojiBySlug(slug);

  if (!item) {
    return { title: "Kaomoji Not Found — Glyphtiq" };
  }

  const category = getKaomojiCategory(item.category);

  return {
    title: `${item.expression} ${item.name} Kaomoji — Meaning & Copy | Glyphtiq`,
    description: `Copy ${item.expression} ${item.name} kaomoji emoticon. ${item.meaning ?? category.description} Includes meaning, usage examples, and related Japanese text faces.`,
  };
}

export default async function KaomojiDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getKaomojiBySlug(slug);

  if (!item) {
    notFound();
  }

  const category = getKaomojiCategory(item.category);
  const related = getRelatedKaomojis(item, 12);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
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
        <Link href={`/kaomojis/${category.slug}`} className="transition-colors hover:text-foreground">
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{item.name}</span>
      </nav>

      {/* Kaomoji Detail Renderer */}
      <KaomojiDetailClient item={item} category={category} related={related} />
    </div>
  );
}
