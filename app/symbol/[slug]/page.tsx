import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/symbols/categories";
import {
  getSymbolBySlug,
  getSymbolsByCategory,
  symbols,
} from "@/lib/symbols/data";
import { getRelatedSymbols } from "@/lib/symbols/related";
import { SymbolDetailClient } from "./SymbolDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Pre-generate top 500 most popular symbols at build time
  return symbols
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 500)
    .map((symbol) => ({
      slug: symbol.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const symbol = getSymbolBySlug(slug);

  if (!symbol) {
    return {
      title: "Symbol Not Found — Glyphtiq",
    };
  }

  const category = getCategory(symbol.category);

  return {
    title: `${symbol.char} ${symbol.name} (U+${symbol.codePoint}) — Copy & Unicode Details | Glyphtiq`,
    description: `Copy ${symbol.char} ${symbol.name} symbol (U+${symbol.codePoint}). Includes JS escape \\u{${symbol.codePoint}}, HTML entity &#x${symbol.codePoint};, Unicode version ${symbol.unicodeVersion}, category ${category.name}, aliases and similar symbols.`,
    openGraph: {
      title: `${symbol.char} ${symbol.name} (U+${symbol.codePoint})`,
      description: `Copy ${symbol.char} ${symbol.name} instantly. Includes code point, JS escape, HTML entities, and related Unicode symbols.`,
    },
  };
}

export default async function SymbolDetailPage({ params }: Props) {
  const { slug } = await params;
  const symbol = getSymbolBySlug(slug);

  if (!symbol) {
    notFound();
  }

  const category = getCategory(symbol.category);
  const relatedSymbols = getRelatedSymbols(symbol, 12);
  const categorySymbols = getSymbolsByCategory(symbol.category).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/symbols" className="transition-colors hover:text-foreground">
          Symbols
        </Link>
        <span>/</span>
        <Link
          href={`/symbols/${category.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {category.name}
        </Link>
        <span>/</span>
        <span className="truncate text-foreground font-semibold">{symbol.name}</span>
      </nav>

      {/* Interactive Detail Renderer */}
      <SymbolDetailClient
        symbol={symbol}
        category={category}
        relatedSymbols={relatedSymbols}
        categorySymbols={categorySymbols}
      />
    </div>
  );
}
