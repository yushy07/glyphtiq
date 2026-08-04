import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { STYLE_COUNT_LABEL } from "@/lib/text-engine/engine";
import { SITE_URL } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Glyphtiq — Fancy Text Generator",
    template: "%s · Glyphtiq",
  },
  description: `Turn plain text into ${STYLE_COUNT_LABEL} unicode fancy styles — bold, cursive, gothic, zalgo, bubble and more. Fast, free and 100% in your browser.`,
  manifest: "/manifest.json",
  alternates: {
    canonical: "./",
  },
  keywords: [
    "fancy text",
    "unicode text",
    "text generator",
    "cool letters",
    "zalgo",
    "weird text",
  ],
  openGraph: {
    title: "Glyphtiq — Fancy Text Generator",
    description: `${STYLE_COUNT_LABEL} unicode styles for your text. Bold, cursive, gothic, bubble and more — right in your browser.`,
    url: SITE_URL,
    siteName: "Glyphtiq",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Glyphtiq — Fancy Text Generator",
    description: `${STYLE_COUNT_LABEL} unicode styles, converted locally.`,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <BackgroundEffects>
              <div className="flex min-h-dvh flex-col">
                <Header />
                <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
                  {children}
                </main>
                <Footer />
              </div>
            </BackgroundEffects>
          </ToastProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
