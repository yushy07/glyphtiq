import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/layout/PageSection";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Glyphtiq handles your data — spoiler: almost everything stays in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <PageHeader
        title="Privacy policy"
        subtitle={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}`}
      />

      <div className="space-y-10">
        <Section title="The short version">
          <p>
            Glyphtiq is built to be private by default. Converting text, copying
            results, favorites and your recent styles all happen inside your
            browser. No accounts, no tracking pixels, no profile built from what
            you type.
          </p>
        </Section>

        <Section title="What stays on your device">
          <ul className="list-disc space-y-1 pl-5">
            <li>Text you type and convert — always local.</li>
            <li>Clipboard operations — handled by your browser.</li>
            <li>Favorites and recently copied styles — stored in <code className="rounded bg-surface-2 px-1 py-0.5 font-mono">localStorage</code>.</li>
            <li>PNG exports — rendered entirely in your browser.</li>
          </ul>
        </Section>

        <Section title="When your text reaches a server">
          <p>
            The only time your text leaves your browser is when you explicitly
            press <strong>Share</strong> to create a short link. That link stores
            your text and the chosen style so the page can be recreated for
            someone else. Links can be set to expire automatically, and they are
            plain text — never rendered as HTML.
          </p>
        </Section>

        <Section title="Anonymous usage statistics">
          <p>
            Glyphtiq records lightweight, anonymous events — such as “a copy
            happened” and which style was copied — to surface popular styles.
            These events never include your typed text, and raw IP addresses are
            not stored.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            The optional short-link and trending features are backed by hosted
            infrastructure (PostgreSQL and a Redis cache). These services are
            used solely to operate the features described above.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            Because almost everything is stored in your browser, you can clear
            your data by clearing the site’s <code className="rounded bg-surface-2 px-1 py-0.5 font-mono">localStorage</code>.
            Shared links are deleted when they expire or when the share is
            removed by an operator.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about privacy? Reach out through the repository or the
            maintainer contact listed on the site.
          </p>
        </Section>
      </div>

      <section className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
        <h2 className="mb-8 text-center text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Privacy, <span className="gradient-text">by design</span>
        </h2>
        <div className="mt-10">
          <div className="w-full overflow-hidden rounded-[28px] border border-border glass">
            <div className="flex flex-col items-center gap-2 px-8 py-10 text-center sm:px-12 sm:py-12">
              <h3 className="text-xl font-black text-foreground sm:text-2xl">
                Your data, <span className="gradient-text">your rules</span>
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Glyphtiq only learns what you choose to share. Everything else
                stays exactly where it belongs — on your device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
