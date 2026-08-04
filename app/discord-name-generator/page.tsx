import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";

export const metadata: Metadata = {
  title: "Discord Name Generator — Aesthetic & Cool Discord Usernames | Glyphtiq",
  description: "Create cool, aesthetic, and funny Discord usernames and nicknames. Supports spaces, symbols, and custom decorations with instant copy.",
};

export default function DiscordNamePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <UsernameStudio initialPlatform="discord" initialTheme="aesthetic" />
    </div>
  );
}
