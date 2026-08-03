import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_CONFIGS, getAppBySlug } from "@/lib/text-engine/apps";
import { AppGenerator } from "@/components/generator/AppGenerator";

type Props = { params: Promise<{ appSlug: string }> };

export function generateStaticParams() {
  return APP_CONFIGS.map((app) => ({ appSlug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { appSlug } = await params;
  const app = getAppBySlug(appSlug);
  if (!app) return { title: "Not found" };
  return {
    title: `${app.title} — Glyphy`,
    description: app.description,
  };
}

export default async function AppGeneratorPage({ params }: Props) {
  const { appSlug } = await params;
  const app = getAppBySlug(appSlug);
  if (!app) notFound();

  return <AppGenerator app={app} />;
}
