import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";

export const metadata: Metadata = {
  title: "Username Generator — Create 300K+ Cool & Stylish Names | Glyphtiq",
  description: "Generate memorable, stylish, and platform-compatible usernames for Instagram, TikTok, Discord, Free Fire, PUBG, Valorant, and Roblox. Rules verification, decorations, and instant copy.",
};

export default function UsernameGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <UsernameStudio initialPlatform="instagram" initialTheme="minimal" />
    </div>
  );
}
