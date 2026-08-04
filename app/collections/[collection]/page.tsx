import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SYMBOL_COLLECTIONS,
  getCollection,
  symbolsInCollection,
} from "@/lib/symbols/collections";
import { CategoryExplorerClient } from "@/app/symbols/[category]/CategoryExplorerClient";

interface Props {
  params: Promise<{ collection: string }>;
}

export async function generateStaticParams() {
  return SYMBOL_COLLECTIONS.map((col) => ({
    collection: col.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: slug } = await params;
  const col = getCollection(slug);

  if (!col) {
    return { title: "Collection Not Found — Glyphtiq" };
  }

  const matchingSymbols = symbolsInCollection(col);

  return {
    title: `${col.name} Symbols Collection (${matchingSymbols.length}) — Copy & Paste | Glyphtiq`,
    description: `Explore and copy ${matchingSymbols.length} ${col.name} symbols. ${col.description} Click any symbol to copy instantly for Instagram bios, Discord, Twitter, or text design.`,
    openGraph: {
      title: `${col.name} Symbol Collection — Glyphtiq`,
      description: col.description,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection: slug } = await params;
  const col = getCollection(slug);

  if (!col) {
    notFound();
  }

  const collectionSymbols = symbolsInCollection(col);
  const otherCollections = SYMBOL_COLLECTIONS.filter(
    (c) => c.slug !== col.slug,
  ).slice(0, 9);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/symbols" className="transition-colors hover:text-foreground">
          Symbols
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{col.name}</span>
      </nav>

      {/* Collection Banner */}
      <header className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Thematic Collection
            </span>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {col.name}
            </h1>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              {col.description} Click any symbol below to copy it instantly to your clipboard.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-center">
            <span className="text-xl font-bold text-primary">
              {collectionSymbols.length.toLocaleString()}
            </span>
            <span className="block text-[11px] font-medium text-muted">
              Symbols
            </span>
          </div>
        </div>
      </header>

      {/* Symbol Grid */}
      <CategoryExplorerClient symbols={collectionSymbols} />

      {/* Other Collections */}
      <section className="mt-16 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Discover More Symbol Collections</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {otherCollections.map((item) => (
            <Link
              key={item.slug}
              href={`/collections/${item.slug}`}
              className="flex flex-col rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
            >
              <span className="font-bold text-foreground text-sm">{item.name}</span>
              <span className="mt-1 text-xs text-muted line-clamp-2">{item.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
