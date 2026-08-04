import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";

export const metadata: Metadata = {
  title: "Valorant Name Generator — Tactical & Pro Valorant IGNs | Glyphtiq",
  description: "Generate clean, pro, and tactical Valorant IGN player handles. Tested for Riot Games 16-character limits and spaces.",
};

export default function ValorantNamePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <UsernameStudio initialPlatform="valorant" initialTheme="ninja" />
    </div>
  );
}
