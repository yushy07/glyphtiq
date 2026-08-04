import { ORGANIZATION_NAME, SITE_NAME, SITE_URL } from "./constants";
import { formatCanonicalUrl } from "./metadata";

/** JSON-LD Helper: SearchAction */
export function getSearchActionJsonLd() {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  };
}

/** JSON-LD Helper: WebSite + SearchAction */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: getSearchActionJsonLd(),
  };
}

/** JSON-LD Helper: Organization */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

/** JSON-LD Helper: WebPage */
export function getWebPageJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: formatCanonicalUrl(path),
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
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
    url: formatCanonicalUrl(path),
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
      item: formatCanonicalUrl(item.path),
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
    url: formatCanonicalUrl(path),
  };
}

/** JSON-LD Helper: CollectionPage */
export function getCollectionPageJsonLd(
  name: string,
  description: string,
  path: string,
  numberOfItems?: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: formatCanonicalUrl(path),
    ...(numberOfItems !== undefined ? { numberOfItems } : {}),
  };
}

/** JSON-LD Helper: ItemList for Collections & Grids */
export function getItemListJsonLd(
  name: string,
  items: Array<{ name: string; path: string; position?: number }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      url: formatCanonicalUrl(item.path),
    })),
  };
}

/** JSON-LD Helper: FAQPage */
export function getFAQPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** JSON-LD Helper: HowTo */
export function getHowToJsonLd(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; url?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: formatCanonicalUrl(step.url) } : {}),
    })),
  };
}
