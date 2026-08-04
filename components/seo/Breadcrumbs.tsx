import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getBreadcrumbJsonLd } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ name: "Home", path: "/" }, ...items];
  const jsonLd = getBreadcrumbJsonLd(allItems);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3 text-muted/50" aria-hidden />}
              {isLast ? (
                <span className="font-semibold text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  {index === 0 && <Home className="size-3" aria-hidden />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
