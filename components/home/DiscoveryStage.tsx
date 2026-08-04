"use client";

import type { AppSection } from "@/lib/text-engine/curation";
import type { TextStyle } from "@/lib/text-engine/types";
import { AppSections } from "@/components/generator/AppSections";
import { StageDivider } from "./StageDivider";

export interface DiscoveryStageProps {
  collections: AppSection[];
  sampleText: string;
  onPick: (style: TextStyle) => void;
}

/** Stage 2: Netflix-style shelves. A click copies the style, then jumps to
 *  and spotlights its Best Styles card. */
export function DiscoveryStage({ collections, sampleText, onPick }: DiscoveryStageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <StageDivider
        emoji="✨"
        title="Discover More"
        subtitle="Explore curated collections chosen for different moods."
      />
      <AppSections sections={collections} sampleText={sampleText} onPick={onPick} />
    </div>
  );
}
