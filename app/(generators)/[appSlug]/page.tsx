import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_CONFIGS, getAppBySlug } from "@/lib/text-engine/apps";
import { AppExperience } from "@/components/app/AppExperience";
import { constructMetadata, getBreadcrumbJsonLd, getWebApplicationJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ appSlug: string }> };

export function generateStaticParams() {
  return APP_CONFIGS.map((app) => ({ appSlug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { appSlug } = await params;
  const app = getAppBySlug(appSlug);
  if (!app) return { title: "Not Found", robots: { index: false } };
  return constructMetadata({
    title: `${app.title} — Glyphtiq`,
    description: app.description,
    path: `/${app.slug}`,
    keywords: [app.name.toLowerCase(), `${app.name.toLowerCase()} font generator`, "cool fancy fonts"],
  });
}

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedClusters } from "@/components/seo/RelatedClusters";

export default async function AppGeneratorPage({ params }: Props) {
  const { appSlug } = await params;
  const app = getAppBySlug(appSlug);
  if (!app) notFound();

  const appJsonLd = getWebApplicationJsonLd(app.title, app.description, `/${app.slug}`);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <Breadcrumbs items={[{ name: "Fonts", path: "/fonts" }, { name: app.name, path: `/${app.slug}` }]} />
      <AppExperience app={app} />
      <RelatedClusters currentPath={`/${app.slug}`} />
    </div>
  );
}
