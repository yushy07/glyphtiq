import type { Metadata } from "next";
import { KaomojiExplorer } from "@/components/kaomoji/KaomojiExplorer";
import { getKaomojiCount } from "@/lib/kaomoji/data";

export const metadata: Metadata = {
  title: "Kaomoji & Emoticon Explorer — Copy 2,000+ Japanese Text Faces | Glyphtiq",
  description: `Browse and copy ${getKaomojiCount().toLocaleString()} Japanese kaomojis & emoticons. Emotion-first categories: happy, cute, sad, shrug ¯\\_(ツ)_/¯, table flip, anime neko, and gaming chat reactions.`,
};

export default function KaomojiPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <KaomojiExplorer />
    </div>
  );
}
