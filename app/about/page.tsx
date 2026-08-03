import type { Metadata } from "next";
import Link from "next/link";
import BorderGlow from "@/components/ui/BorderGlow";
import { PageHeader, Section } from "@/components/layout/PageSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Glyphy turns plain text into 100+ unicode styles — right in your browser. Fast, free and private.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <PageHeader
        title={
          <>
            About <span className="gradient-text">Glyphy</span>
          </>
        }
        subtitle="A tiny tool for making plain words look anything but plain."
      />

      <div className="space-y-10">
        <Section title="What Glyphy is">
          <p>
            Glyphy is a free, browser-based fancy text generator. Type something
            plain and it instantly shows you 100+ unicode variations — bold,
            cursive, gothic, bubble, zalgo, upside-down and everything in
            between.
          </p>
          <p>
            There is no account, no upload and no learning curve. You type, you
            copy, you paste it wherever fancy text belongs.
          </p>
        </Section>

        <Section title="Why we built it">
          <p>
            Text is the most universal thing on the internet, yet almost
            everything you type looks the same. Unicode is full of beautiful
            characters hiding in plain sight — Glyphy makes them one click
            away.
          </p>
          <p>
            We built it because we wanted a converter that was instant, free and
            private, instead of the slow, ad-covered converters scattered around
            the web.
          </p>
        </Section>

        <Section title="What makes it different">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Fast</strong> — every style converts locally the moment
              you type.
            </li>
            <li>
              <strong>Private</strong> — your text never leaves your browser
              unless you choose to share it.
            </li>
            <li>
              <strong>Free</strong> — no accounts, no paywalls, no sign-ups.
            </li>
            <li>
              <strong>Composable</strong> — a live preview of every style, plus
              search, favorites and a style picker.
            </li>
          </ul>
        </Section>

        <Section title="How it works under the hood">
          <p>
            Glyphy maps your characters through unicode lookalike sets — fullwidth
            forms, mathematical letters, small caps, combining diacritics and
            more — then renders the result on a live canvas. Everything runs in
            your browser; the only server calls are for the optional share links
            and anonymous popularity stats.
          </p>
        </Section>

        <Section title="Who it's for">
          <p>
            Gamers customising usernames, streamers styling chat, designers
            mocking up copy, social media managers dressing up posts — or
            anyone who simply likes how <em>ｔｈｉｓ</em> looks.
          </p>
        </Section>
      </div>

      <section className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
        <BorderGlow
          animated
          edgeSensitivity={30}
          glowColor="139, 92, 246"
          backgroundColor="color-mix(in srgb, var(--surface) 45%, transparent)"
          borderRadius={28}
          glowRadius={40}
          glowIntensity={2.2}
          coneSpread={25}
          colors={["#8b5cf6", "#ff4d9d", "#22d3ee"]}
          className="w-full backdrop-blur-xl"
        >
          <div className="flex flex-col items-center gap-2 px-8 py-10 text-center sm:px-12 sm:py-12">
            <h3 className="text-xl font-black text-foreground sm:text-2xl">
              Made to be <span className="gradient-text">shared</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Have feedback or an idea? Say hello — we actually read
              everything.
            </p>
            <Link
              href="/contact"
              className="btn-gradient inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get in touch
            </Link>
          </div>
        </BorderGlow>
      </section>
    </div>
  );
}
