import type { Metadata } from "next";

interface SEOOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}

export function buildMetadata({ title, description, path, type = "website", image }: SEOOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glyphtiq.vercel.app";
  const url = `${baseUrl}${path}`;
  const defaultImage = `${baseUrl}/opengraph-image.png`;

  return {
    title: `${title} — Glyphtiq`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} — Glyphtiq`,
      description,
      url,
      siteName: "Glyphtiq",
      type,
      images: [
        {
          url: image ?? defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Glyphtiq`,
      description,
      images: [image ?? defaultImage],
    },
  };
}

export function generateBreadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glyphtiq.vercel.app";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}
