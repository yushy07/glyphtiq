import Link from "next/link";
import { SearchX } from "lucide-react";
import BorderGlow from "@/components/ui/BorderGlow";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
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
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-surface-2">
            <SearchX className="size-7 text-muted" aria-hidden />
          </span>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Nothing here
          </h1>
          <p className="text-sm text-muted">
            That link may be expired or was never shared.
          </p>
          <Link
            href="/"
            className="btn-gradient inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Make something fancy
          </Link>
        </div>
      </BorderGlow>
    </div>
  );
}
