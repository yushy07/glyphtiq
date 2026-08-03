import Link from "next/link";
import Image from "next/image";

const PAGE_LINKS = [
  { href: "/", label: "Generator" },
  { href: "/fonts", label: "All fonts" },
  { href: "/#why", label: "Why Glyphy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-28 md:pb-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-border">
                <Image
                  src="/glyphy-mark.svg"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 object-cover"
                />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                <span className="gradient-text">Glyphy</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Turn plain text into 100+ unicode fancy styles — fast, free and
              right in your browser.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold tracking-widest text-muted uppercase">
              Pages
            </h3>
            <ul className="space-y-2">
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold tracking-widest text-muted uppercase">
              Legal
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold tracking-widest text-muted uppercase">
              Start creating
            </h3>
            <Link
              href="/#generator"
              className="btn-gradient inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Open the generator
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Everything converts locally in your browser — nothing is sent to a server until you share a link.</span>
          <span>Glyphy © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
