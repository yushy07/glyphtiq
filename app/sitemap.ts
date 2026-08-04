import type { MetadataRoute } from "next";
import { KAOMOJI_CATEGORY_LIST } from "@/lib/kaomoji/categories";
import { kaomojis } from "@/lib/kaomoji/data";
import { SYMBOL_CATEGORY_LIST } from "@/lib/symbols/categories";
import { SYMBOL_COLLECTIONS } from "@/lib/symbols/collections";
import { symbols } from "@/lib/symbols/data";
import { APP_SLUGS } from "@/lib/text-engine/apps";
import { CATEGORIES } from "@/lib/text-engine/engine";
import { THEME_LIST } from "@/lib/usernames/themes";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/fonts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/symbols`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/kaomoji`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/username-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/free-fire-name-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/discord-name-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/valorant-name-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const appPages: MetadataRoute.Sitemap = APP_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const textCategoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const symbolCategoryPages: MetadataRoute.Sitemap = SYMBOL_CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/symbols/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const symbolCollectionPages: MetadataRoute.Sitemap = SYMBOL_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const kaomojiCategoryPages: MetadataRoute.Sitemap = KAOMOJI_CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/kaomojis/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const usernameThemePages: MetadataRoute.Sitemap = THEME_LIST.map((t) => ({
    url: `${baseUrl}/usernames/${t.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const topSymbolPages: MetadataRoute.Sitemap = symbols
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 500)
    .map((s) => ({
      url: `${baseUrl}/symbol/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const topKaomojiPages: MetadataRoute.Sitemap = kaomojis
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 300)
    .map((k) => ({
      url: `${baseUrl}/kaomoji/${k.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...appPages,
    ...textCategoryPages,
    ...symbolCategoryPages,
    ...symbolCollectionPages,
    ...kaomojiCategoryPages,
    ...usernameThemePages,
    ...topSymbolPages,
    ...topKaomojiPages,
  ];
}
