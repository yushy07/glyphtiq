import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToastProvider } from "@/components/ui/Toast";
import ClickSpark from "@/components/ui/ClickSpark";
import FloatingLines from "@/components/ui/FloatingLines";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glyphy.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Glyphy — Fancy Text Generator",
    template: "%s · Glyphy",
  },
  description:
    "Turn plain text into 100+ unicode fancy styles — bold, cursive, gothic, zalgo, bubble and more. Fast, free and 100% in your browser.",
  manifest: "/manifest.json",
  keywords: [
    "fancy text",
    "unicode text",
    "text generator",
    "cool letters",
    "zalgo",
    "weird text",
  ],
  openGraph: {
    title: "Glyphy — Fancy Text Generator",
    description:
      "100+ unicode styles for your text. Bold, cursive, gothic, bubble and more — right in your browser.",
    url: SITE_URL,
    siteName: "Glyphy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Glyphy — Fancy Text Generator",
    description: "100+ unicode styles, converted locally.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <FloatingLines
              linesGradient={["#8b5cf6", "#ff4d9d", "#22d3ee"]}
              enabledWaves={["top", "middle", "bottom"]}
              lineCount={[10, 15, 20]}
              lineDistance={21.5}
              bendRadius={6}
              bendStrength={-1.5}
              animationSpeed={3.2}
              parallax
              parallaxStrength={0.2}
              interactive
              mixBlendMode="screen"
              style={{ position: "fixed", inset: 0, zIndex: -1 }}
            />
            <ClickSpark
              sparkColor="#a78bfa"
              sparkSize={18}
              sparkRadius={34}
              sparkCount={10}
              duration={500}
            >
              <div className="flex min-h-dvh flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
                <MobileNav />
              </div>
            </ClickSpark>
          </ToastProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
