import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/text-engine/engine";
import { STYLES } from "@/lib/text-engine/styles";
import { PageHeader } from "@/components/layout/PageSection";

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
    description: `Browse ${CATEGORY_LABELS[resolved].toLowerCase()} font styles and convert your own text in one tap.`,
    path: `/categories/${resolved}`,
    keywords: [`${CATEGORY_LABELS[resolved].toLowerCase()} fonts`, `${CATEGORY_LABELS[resolved].toLowerCase()} text`, "font generator"],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const resolved = resolveCategory(category);
  if (!resolved) notFound();

  const label = CATEGORY_LABELS[resolved];
  const styles = STYLES.filter((s) => !s.hidden && s.category === resolved);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
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
    </div>
  );
}
