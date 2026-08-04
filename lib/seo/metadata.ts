import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  ORGANIZATION_NAME,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "./constants";

export type MetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  type?: "website" | "article";
};

export function formatCanonicalUrl(path: string = ""): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  keywords = [],
  noIndex = false,
  image = DEFAULT_IMAGE,
  type = "website",
}: MetadataOptions): Metadata {
  const url = formatCanonicalUrl(path);
  const formattedTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const mergedKeywords = Array.from(new Set([...keywords, ...DEFAULT_KEYWORDS]));
  const imageUrl = image.startsWith("http") ? image : formatCanonicalUrl(image);

  return {
    title: {
      absolute: formattedTitle,
    },
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
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
      title: formattedTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [imageUrl],
      creator: TWITTER_HANDLE,
    },
    authors: [{ name: ORGANIZATION_NAME, url }],
    creator: ORGANIZATION_NAME,
    publisher: ORGANIZATION_NAME,
    applicationName: SITE_NAME,
  };
}
