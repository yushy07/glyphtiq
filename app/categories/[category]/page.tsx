import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/text-engine/engine";
import { STYLES } from "@/lib/text-engine/styles";
import { PageHeader } from "@/components/layout/PageSection";
import { PageContentGuide } from "@/components/seo/PageContentGuide";
import { getCategoryContent } from "@/lib/seo/content";

import { constructMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

function resolveCategory(raw: string): (typeof CATEGORIES)[number] | null {
  const match = CATEGORIES.find((c) => c === raw);
  return match ?? null;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const resolved = resolveCategory(category);
  if (!resolved) return constructMetadata({ title: "Not Found — Glyphtiq", noIndex: true });
  return constructMetadata({
    title: `${CATEGORY_LABELS[resolved]} Fonts — Glyphtiq`,
    description: `Browse and copy ${CATEGORY_LABELS[resolved].toLowerCase()} font styles to convert plain text into fancy unicode letters. 100% free, instant, and works right in your browser.`,
    path: `/categories/${resolved}`,
    keywords: [`${CATEGORY_LABELS[resolved].toLowerCase()} fonts`, `${CATEGORY_LABELS[resolved].toLowerCase()} text`, "font generator"],
  });
}

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const resolved = resolveCategory(category);
  if (!resolved) notFound();

  const label = CATEGORY_LABELS[resolved];
  const styles = STYLES.filter((s) => !s.hidden && s.category === resolved);
  const content = getCategoryContent(resolved, label, styles.length);
  const otherCategories = CATEGORIES.filter((c) => c !== resolved).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ name: "Fonts", path: "/fonts" }, { name: `${label} Fonts`, path: `/categories/${resolved}` }]} />

      <PageHeader
        title={`${label} fonts`}
        subtitle={`${styles.length} ${label.toLowerCase()} styles that convert any text in your browser.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => (
          <div
            key={style.id}
            className="flex flex-col gap-3 rounded-2xl border border-border glass p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-bold text-foreground">{style.name}</h3>
              <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                {label}
              </span>
            </div>
            <p className="break-words rounded-xl bg-surface-2 p-3 text-base leading-relaxed text-foreground">
              {style.convert("Glyphtiq")}
            </p>
            <p className="text-sm text-muted">{style.description}</p>
            <Link
              href={`/?text=Glyphtiq&category=${resolved}&style=${style.id}`}
              className="group mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border glass px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Try in generator
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        ))}
      </div>

      <PageContentGuide
        title={content.introTitle}
        intro={content.introParagraph}
        faqs={content.faqs}
      />

      {/* Sibling Category Explorer */}
      <section className="mt-16 rounded-3xl border border-border/80 bg-card/40 p-8">
        <h2 className="text-lg font-bold text-foreground">Explore Other Font Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherCategories.map((catKey) => {
            const catLabel = CATEGORY_LABELS[catKey];
            const catStyles = STYLES.filter((s) => !s.hidden && s.category === catKey);
            return (
              <Link
                key={catKey}
                href={`/categories/${catKey}`}
                className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
              >
                <div>
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                    {catLabel} Fonts
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {catStyles.length} styles
                  </span>
                </div>
                <span className="mt-2 text-xs font-semibold text-primary">Browse →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <RelatedClusters currentPath={`/categories/${resolved}`} />
    </div>
  );
}
