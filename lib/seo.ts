import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://glyphtiq.vercel.app");

export interface ConstructMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

/**
 * Reusable Metadata Helper for Next.js App Router.
 * Ensures every page gets an absolute canonical URL, OG, Twitter, and robots configuration.
 */
export function constructMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image = "/opengraph-image.png",
  noindex = false,
  type = "website",
}: ConstructMetadataOptions): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const defaultKeywords = [
    "fancy text generator",
    "unicode text generator",
    "cool letters",
    "text font changer",
    "copy and paste symbols",
    "kaomoji generator",
    "username generator",
  ];

  return {
    title: {
      absolute: title.includes("Glyphtiq") ? title : `${title} — Glyphtiq`,
    },
    description,
    keywords: Array.from(new Set([...keywords, ...defaultKeywords])),
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: "Glyphtiq",
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
    },
  };
}

/** JSON-LD Helper: WebSite + SearchAction */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Glyphtiq",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** JSON-LD Helper: WebApplication / SoftwareApplication */
export function getWebApplicationJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** JSON-LD Helper: BreadcrumbList */
export function getBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/** JSON-LD Helper: DefinedTerm for Symbol/Kaomoji */
export function getDefinedTermJsonLd(name: string, char: string, category: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: `${char} ${name}`,
    termCode: char,
    inDefinedTermSet: `${SITE_URL}/symbols`,
    description: `Unicode character ${char} (${name}) in ${category}. Copy and paste instantly.`,
    url: `${SITE_URL}${path}`,
  };
}
